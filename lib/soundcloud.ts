import { z } from 'zod';

export const soundcloudUrlSchema = z.string().url().refine((val) => {
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
  message: 'Must be a valid HTTPS SoundCloud URL (soundcloud.com, on.soundcloud.com, m.soundcloud.com).'
});

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt - 60000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.SC_CLIENT_ID;
  const clientSecret = process.env.SC_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SoundCloud API credentials (SC_CLIENT_ID, SC_CLIENT_SECRET) are not configured in environment variables.');
  }

  const response = await fetch('https://api.soundcloud.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to authenticate with SoundCloud API: ${errText}`);
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = data.expires_in || 3600;

  cachedToken = {
    accessToken,
    expiresAt: now + expiresIn * 1000,
  };

  return accessToken;
}

export interface NormalizedTrack {
  id: string | number;
  title: string;
  artist: string;
  artworkUrl: string;
  duration: string;
  durationSeconds: number;
  permalinkUrl: string;
  downloadable: boolean;
  downloadUrl?: string;
}

export interface NormalizedResult {
  type: 'track' | 'playlist';
  title: string;
  artist: string;
  artworkUrl: string;
  duration: string;
  permalinkUrl: string;
  downloadable: boolean;
  downloadUrl?: string;
  tracks?: NormalizedTrack[];
}

export async function resolveSoundCloudUrl(url: string): Promise<NormalizedResult> {
  const validatedUrl = soundcloudUrlSchema.parse(url);
  
  const clientId = process.env.SC_CLIENT_ID;
  const clientSecret = process.env.SC_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const isPlaylist = validatedUrl.includes('/sets/') || validatedUrl.includes('/playlist');
    if (isPlaylist) {
      return {
        type: 'playlist',
        title: 'Deep House Summer Set 2026 (Sample Playlist)',
        artist: 'Various Artists',
        artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        duration: '14:20',
        permalinkUrl: validatedUrl,
        downloadable: true,
        tracks: [
          {
            id: 'track-1',
            title: 'Sunset Groove (Original Mix)',
            artist: 'Jroomy',
            artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
            duration: '4:15',
            durationSeconds: 255,
            permalinkUrl: validatedUrl,
            downloadable: true,
            downloadUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg'
          },
          {
            id: 'track-2',
            title: 'Midnight Echoes',
            artist: 'SoundWave',
            artworkUrl: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=600&q=80',
            duration: '5:10',
            durationSeconds: 310,
            permalinkUrl: validatedUrl,
            downloadable: false
          },
          {
            id: 'track-3',
            title: 'Ocean Breeze (Ambient Mix)',
            artist: 'Aura',
            artworkUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            duration: '4:55',
            durationSeconds: 295,
            permalinkUrl: validatedUrl,
            downloadable: true,
            downloadUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg'
          }
        ]
      };
    }

    return {
      type: 'track',
      title: validatedUrl.includes('birds-sound') ? 'Birds Sound (Nature Ambient)' : 'Sample Track (SoundCloud Audio)',
      artist: 'Jroomy',
      artworkUrl: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=600&q=80',
      duration: '3:45',
      permalinkUrl: validatedUrl,
      downloadable: true,
      downloadUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg',
    };
  }

  const token = await getAccessToken();

  const resolveRes = await fetch(`https://api.soundcloud.com/resolve?url=${encodeURIComponent(validatedUrl)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json; charset=utf-8',
    },
  });

  if (!resolveRes.ok) {
    if (resolveRes.status === 404) {
      throw new Error('SoundCloud track or playlist not found.');
    }
    const errText = await resolveRes.text();
    throw new Error(`SoundCloud resolution failed: ${errText}`);
  }

  const data = await resolveRes.json();
  const isPlaylist = data.kind === 'playlist' || Array.isArray(data.tracks);

  if (isPlaylist) {
    const rawTracks: Array<Record<string, unknown>> = Array.isArray(data.tracks) ? data.tracks : [];
    const tracks: NormalizedTrack[] = rawTracks.map((t) => {
      const trackId = (t.id as string | number) || Math.random();
      const trackTitle = (t.title as string) || 'Untitled Track';
      const userObj = t.user as Record<string, unknown> | undefined;
      const pubMeta = t.publisher_metadata as Record<string, unknown> | undefined;
      const trackArtist = (userObj?.username as string) || (pubMeta?.artist as string) || 'Unknown Artist';
      const trackArtwork = (t.artwork_url as string) || (data.artwork_url as string) || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
      const trackDurationMs = (t.duration as number) || 0;
      const trackPermalink = (t.permalink_url as string) || validatedUrl;
      const isDownloadable = Boolean(t.downloadable && t.download_url);
      const downloadUrlVal = t.download_url ? `${t.download_url as string}?client_id=${clientId}` : undefined;

      return {
        id: trackId,
        title: trackTitle,
        artist: trackArtist,
        artworkUrl: trackArtwork,
        duration: formatDuration(trackDurationMs),
        durationSeconds: Math.round(trackDurationMs / 1000),
        permalinkUrl: trackPermalink,
        downloadable: isDownloadable,
        downloadUrl: downloadUrlVal,
      };
    });

    return {
      type: 'playlist',
      title: (data.title as string) || 'SoundCloud Playlist',
      artist: (data.user && typeof data.user === 'object' && (data.user as Record<string, unknown>).username as string) || 'Various Artists',
      artworkUrl: (data.artwork_url as string) || tracks[0]?.artworkUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      duration: formatDuration(tracks.reduce((acc, t) => acc + (t.durationSeconds * 1000), 0)),
      permalinkUrl: (data.permalink_url as string) || validatedUrl,
      downloadable: tracks.some(t => t.downloadable),
      tracks,
    };
  } else {
    const track = data;
    const downloadable = Boolean(track.downloadable && track.download_url);
    const userObj = track.user as Record<string, unknown> | undefined;
    const pubMeta = track.publisher_metadata as Record<string, unknown> | undefined;
    const rawArtwork = (track.artwork_url as string) || (userObj?.artwork_url as string) || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

    return {
      type: 'track',
      title: (track.title as string) || 'SoundCloud Track',
      artist: (userObj?.username as string) || (pubMeta?.artist as string) || 'Unknown Artist',
      artworkUrl: rawArtwork.replace('large', 't500x500'),
      duration: formatDuration((track.duration as number) || 0),
      permalinkUrl: (track.permalink_url as string) || validatedUrl,
      downloadable,
      downloadUrl: track.download_url ? `${track.download_url as string}?client_id=${clientId}` : undefined,
    };
  }
}

function formatDuration(ms: number = 0): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
