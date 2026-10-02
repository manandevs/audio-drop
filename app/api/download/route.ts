import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'SoundCloud Track';
    const artist = searchParams.get('artist') || 'SoundCloud Artist';

    // Fallback audio source if none provided
    const sourceUrl = trackUrl && trackUrl.startsWith('http') 
      ? trackUrl 
      : 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg';

    // Fetch remote audio stream
    const audioRes = await fetch(sourceUrl);
    if (!audioRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    // Sanitize filename
    const safeFilename = `${artist} - ${title}`.replace(/[/\\?%*:|"<>]/g, '').trim() + '.mp3';

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json({ error: 'Internal server error during download' }, { status: 500 });
  }
}
