import { useState } from 'react';

export interface PreviewData {
  title: string;
  author: string;
  thumbnailUrl: string;
  html: string;
}

export function usePreview() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid SoundCloud URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(url.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 400) {
          throw new Error(json.error || 'Invalid SoundCloud URL.');
        } else if (res.status === 404) {
          throw new Error(json.error || 'SoundCloud track not found.');
        } else if (res.status === 429) {
          throw new Error(json.error || 'Rate limit exceeded. Please wait a moment.');
        } else {
          throw new Error(json.error || 'Failed to fetch preview.');
        }
      }

      setData(json.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchPreview,
    setData,
    setError,
  };
}
