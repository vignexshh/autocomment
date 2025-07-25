'use client';

import { googleOAuthConfig } from '@/lib/googleOAuth';
import { useRouter } from 'next/navigation';
import qs from 'query-string';

export default function ConnectYouTube() {
  const router = useRouter();

  const handleConnect = () => {
    const query = qs.stringify({
      client_id: googleOAuthConfig.clientId,
      redirect_uri: googleOAuthConfig.redirectUri,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: googleOAuthConfig.scope,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
  };

  return (
    <button onClick={handleConnect} className="p-2 bg-blue-600 text-white rounded">
      Connect YouTube
    </button>
  );
}
