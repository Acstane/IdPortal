import { NextResponse } from 'next/server';
import { logout } from '@/lib/ory/kratos';
import { getConsentRequest } from '@/lib/ory/hydra';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const returnToParam = url.searchParams.get('returnTo') || '/';
  const consent_challenge = url.searchParams.get('consent_challenge');

  let redirectUrl = `${process.env.NEXT_PUBLIC_ID_PUBLIC_URL}${returnToParam}`;

  try {
    if (consent_challenge) {
      const consentRequest = await getConsentRequest(consent_challenge);
      if (consentRequest?.request_url) {
        redirectUrl = consentRequest.request_url;
      }
    }

    const cookie = req.headers.get('cookie') || undefined;

    const logoutRequest = await logout(cookie?.toString(), redirectUrl);

    return NextResponse.redirect(logoutRequest.logout_url);
  } catch {
    const separator = redirectUrl.includes('?') ? '&' : '?';
    const errorUrl = `${redirectUrl}${separator}error=logout&message=Could%20not%20logout.`;

    return NextResponse.redirect(errorUrl);
  }
}
