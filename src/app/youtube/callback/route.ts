import { googleOAuthConfig } from '@/lib/googleOAuth';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code: code ?? '',
        client_id: googleOAuthConfig.clientId ?? '',
        client_secret: googleOAuthConfig.clientSecret ?? '',
        redirect_uri: googleOAuthConfig.redirectUri ?? '',
        grant_type: 'authorization_code',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // TODO: Send to n8n webhook, store in DB, or encrypt + return to client
    console.log({ access_token, refresh_token, expires_in });

    // Optionally extract user email if available (set to null if not)
    const userEmail = null;

    // Send tokens to n8n webhook
    await fetch('https://superiorgrowth.app.n8n.cloud/webhook/youtube-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token,
        refresh_token,
        expires_in,
        email: userEmail, // optional, if you can extract it
      }),
    });

    return NextResponse.redirect(new URL('/success', req.url));

  } catch (err: any) {
    return NextResponse.json({ error: 'Token exchange failed', detail: err.message }, { status: 500 });
  }
}
