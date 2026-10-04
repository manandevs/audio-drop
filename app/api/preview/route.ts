import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';

// Zod schema for SoundCloud URL validation (SSRF protection)
const soundcloudUrlSchema = z.string().url().refine((val) => {
  try {
    const parsed = new URL(val);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === 'soundcloud.com' ||
      hostname.endsWith('.soundcloud.com') ||
      hostname === 'on.soundcloud.com' ||
      hostname === 'm.soundcloud.com'
    );
  } catch {
    return false;
  }
}, {
  message: 'Invalid SoundCloud URL. Must be an https:// link from soundcloud.com, on.soundcloud.com, or m.soundcloud.com.'
});

export async function GET(req: NextRequest) {
  try {
    // 1. Rate limiting (10 req/min per IP)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateLimit = checkRateLimit(ip, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get('url');

    if (!urlParam) {
      return NextResponse.json(
        { success: false, error: 'Missing url query parameter.' },
        { status: 400 }
      );
    }

    // 2. Validate URL with Zod
    const validationResult = soundcloudUrlSchema.safeParse(urlParam.trim());
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0]?.message || 'Invalid SoundCloud URL.' },
        { status: 400 }
      );
    }

    const validatedUrl = validationResult.data;

    // 3. Fetch from SoundCloud oEmbed API
    const oembedEndpoint = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(validatedUrl)}`;
    const oembedRes = await fetch(oembedEndpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Compatible; DownCloudMeBot/1.0)'
      }
    });

    if (!oembedRes.ok) {
      if (oembedRes.status === 404 || oembedRes.status === 400) {
        return NextResponse.json(
          { success: false, error: 'SoundCloud track not found or unavailable.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to fetch preview from SoundCloud.' },
        { status: 502 }
      );
    }

    const oembedData = await oembedRes.json();

    // 4. Return normalized preview object
    const preview = {
      title: oembedData.title || 'SoundCloud Track',
      author: oembedData.author_name || 'SoundCloud Artist',
      thumbnailUrl: oembedData.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      html: oembedData.html || ''
    };

    return NextResponse.json({
      success: true,
      data: preview
    });

  } catch (error: unknown) {
    console.error('Preview API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing preview.' },
      { status: 500 }
    );
  }
}
