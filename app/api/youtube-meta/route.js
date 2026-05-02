import { NextResponse } from 'next/server';

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ message: 'URL required' }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ message: 'Invalid YouTube URL' }, { status: 400 });

    // Use noembed (no API key needed) for title + thumbnail
    const oembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const oembed = await oembedRes.json();

    // Try YouTube page for duration (scrape from page data)
    let duration = '';
    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en' },
      });
      const html = await pageRes.text();
      // Try to extract duration from page meta
      const durMatch = html.match(/"lengthSeconds":"(\d+)"/);
      if (durMatch) {
        const secs = parseInt(durMatch[1]);
        const mins = Math.floor(secs / 60);
        const hrs = Math.floor(mins / 60);
        duration = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins} MIN`;
      }
      // Try to get description
      const descMatch = html.match(/"shortDescription":"(.*?)(?<!\\)"/);
      var description = '';
      if (descMatch) {
        description = descMatch[1]
          .replace(/\\n/g, ' ')
          .replace(/\\"/g, '"')
          .substring(0, 200);
      }
    } catch {}

    return NextResponse.json({
      title: oembed.title || '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: duration || '',
      description: description || '',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch video data' }, { status: 500 });
  }
}
