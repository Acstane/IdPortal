import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/ory/kratos';
import { acceptLoginRequest } from '@/lib/ory/hydra';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const loginChallenge = url.searchParams.get('login_challenge');
  const cookieHeader = req.headers.get('cookie') || undefined;

  try {
    const session = await getSession(cookieHeader);

    if (!loginChallenge) {
      const redirectUrl = session?.identity?.id
        ? new URL('/', process.env.NEXT_PUBLIC_ID_PUBLIC_URL).toString()
        : new URL('/login', process.env.NEXT_PUBLIC_ID_PUBLIC_URL).toString();
      return NextResponse.redirect(redirectUrl);
    }

    if (session?.identity?.id) {
      const { redirect_to } = await acceptLoginRequest(
        loginChallenge,
        session.identity.id,
      );
      return NextResponse.redirect(redirect_to);
    }

    return NextResponse.redirect(
      new URL(
        `/login?login_challenge=${loginChallenge}`,
        process.env.NEXT_PUBLIC_ID_PUBLIC_URL,
      ).toString(),
    );
  } catch {
    if (loginChallenge) {
      return NextResponse.redirect(
        new URL(
          `/login?login_challenge=${loginChallenge}`,
          process.env.NEXT_PUBLIC_ID_PUBLIC_URL,
        ).toString(),
      );
    }

    return NextResponse.redirect(
      new URL('/login', process.env.NEXT_PUBLIC_ID_PUBLIC_URL).toString(),
    );
  }
}
