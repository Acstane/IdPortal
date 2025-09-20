import { getConsentRequest } from '@/lib/ory/hydra';
import { OAuth2ConsentRequest } from '@ory/hydra-client';

interface ConsentPageProps {
  searchParams: Promise<{ consent_challenge?: string }>;
}

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const params = await searchParams;
  const challenge = params.consent_challenge;

  if (!challenge) {
    return <div>No consent_challenge provided in URL</div>;
  }

  let consentRequest: OAuth2ConsentRequest | null = null;

  try {
    consentRequest = await getConsentRequest(challenge);
  } catch (err) {
    console.error(err);
    return <div>Failed to fetch consent request</div>;
  }

  if (!consentRequest) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Consent Request for: {consentRequest.client?.client_name}</h1>
      <p>
        <strong>Requested scopes:</strong>{' '}
        {consentRequest.requested_scope?.join(', ')}
      </p>
      <p>
        <strong>User:</strong> {consentRequest.subject}
      </p>

      <form
        method="post"
        action="/api/consent"
        style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
      >
        <input type="hidden" name="consent_challenge" value={challenge} />
        <button name="action" value="accept" type="submit">
          Accept
        </button>
        <button name="action" value="reject" type="submit">
          Reject
        </button>
      </form>

      <div>
        <p>Want to change the account?</p>
        <a href={`/api/logout?consent_challenge=${challenge}`}>
          Logout and switch account
        </a>
      </div>

      <pre
        style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem' }}
      >
        {JSON.stringify(consentRequest, null, 2)}
      </pre>
    </div>
  );
}
