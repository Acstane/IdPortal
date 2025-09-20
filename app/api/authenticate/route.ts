import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/ory/kratos';
import { acceptLoginRequest } from '@/lib/ory/hydra';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const loginChallenge = url.searchParams.get('login_challenge');

  if (!loginChallenge) {
    return NextResponse.json(
      { error: 'Missing login_challenge' },
      { status: 400 },
    );
  }

  const cookieHeader = req.headers.get('cookie') || undefined;

  try {
    const session = await getSession(cookieHeader);

    const redirectUrl = session?.identity?.id
      ? (await acceptLoginRequest(loginChallenge, session.identity.id))
          .redirect_to
      : new URL(
          `/login?login_challenge=${loginChallenge}`,
          process.env.NEXT_PUBLIC_ID_PUBLIC_URL,
        ).toString();

    return NextResponse.redirect(redirectUrl);
  } catch {
    const fallbackUrl = new URL(
      `/login?login_challenge=${loginChallenge}`,
      process.env.NEXT_PUBLIC_ID_PUBLIC_URL,
    ).toString();
    return NextResponse.redirect(fallbackUrl);
  }
}
