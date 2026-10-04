import { NextRequest, NextResponse } from 'next/server';
import { resolveSoundCloudUrl, soundcloudUrlSchema } from '@/lib/soundcloud';
import { checkRateLimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateLimit = checkRateLimit(ip, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a minute before making more requests.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid SoundCloud URL is required.' },
        { status: 400 }
      );
    }

    const validationResult = soundcloudUrlSchema.safeParse(url.trim());
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Only soundcloud.com, on.soundcloud.com, and m.soundcloud.com URLs are supported.' },
        { status: 400 }
      );
    }

    const result = await resolveSoundCloudUrl(validationResult.data);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: unknown) {
    console.error('Resolve API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to resolve SoundCloud URL.';
    const statusCode = errorMessage.includes('not found') ? 404 : 500;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
