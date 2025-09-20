import { NextRequest, NextResponse } from 'next/server';

import {
  acceptConsentRequest,
  getConsentRequest,
  rejectConsentRequest,
} from '@/lib/ory/hydra';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const consent_challenge = body.get('consent_challenge')?.toString();
    const action = body.get('action')?.toString();

    if (!consent_challenge) {
      return NextResponse.json(
        { error: 'Missing consent_challenge' },
        { status: 400 },
      );
    }

    const consentRequest = await getConsentRequest(consent_challenge);

    if (action === 'accept') {
      const acceptResponse = await acceptConsentRequest(
        consent_challenge,
        consentRequest.requested_scope,
      );
      return NextResponse.redirect(acceptResponse.redirect_to);
    } else if (action === 'reject') {
      const rejectResponse = await rejectConsentRequest(consent_challenge);
      return NextResponse.redirect(rejectResponse.redirect_to);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
