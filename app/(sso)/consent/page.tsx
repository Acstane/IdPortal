import Loading from '@/components/ui/Loading';
import { getRequestDomain } from '@/lib/ory/form-labels';
import { getConsentRequest } from '@/lib/ory/hydra';
import { getIdentity } from '@/lib/ory/kratos';
import { OAuth2ConsentRequest } from '@ory/hydra-client';

import { LuUserRound } from 'react-icons/lu';
import { MdLogout } from 'react-icons/md';

import { BiUser, BiMailSend, BiIdCard, BiKey } from 'react-icons/bi';

import { FaChartBar } from 'react-icons/fa';

interface ConsentPageProps {
  searchParams: Promise<{ consent_challenge?: string }>;
}

interface Scope {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const scopes: Record<string, Scope> = {
  email: {
    name: 'Email',
    description: 'Access your email address',
    icon: <BiMailSend className="w-4 h-4 text-purple-600 mr-3" />,
  },
  profile: {
    name: 'Profile',
    description: 'Access your basic profile info',
    icon: <BiUser className="w-4 h-4 text-purple-600 mr-3" />,
  },
  offline: {
    name: 'Offline Access',
    description: 'Access your account when you are offline',
    icon: <BiKey className="w-4 h-4 text-purple-600 mr-3" />,
  },
  'metrics:discord-dashboard': {
    name: 'Discord Dashboard',
    description: 'View your discord-dashboard metrics',
    icon: <FaChartBar className="w-4 h-4 text-purple-600 mr-3" />,
  },
};

const wereNotSpecificScopesRequested = (
  consentRequest: OAuth2ConsentRequest,
) => {
  return (
    !consentRequest.requested_scope ||
    consentRequest.requested_scope.length === 0 ||
    (consentRequest.requested_scope.length === 1 &&
      consentRequest.requested_scope[0] === 'openid')
  );
};

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

  const identity = await getIdentity(consentRequest.subject!);
  const {
    traits: { name, email },
  } = identity;

  if (!consentRequest) return <Loading />;

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Authorize Application
        </h1>
        <p className="text-gray-600 text-sm">
          You are about to authorize{' '}
          <span className="font-semibold gradient-text text-transparent bg-clip-text">
            {getRequestDomain(consentRequest.request_url)}
          </span>{' '}
          to access your account
        </p>
      </div>

      <div>
        <div className="flex items-center justify-center space-x-3 px-3 rounded-lg mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <LuUserRound className="text-gray-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {name?.first +
                ' ' +
                (name?.middle ? `${name?.middle} ${name?.last}` : name?.last)}
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>

        {!wereNotSpecificScopesRequested(consentRequest) ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                This will allow {getRequestDomain(consentRequest.request_url)}{' '}
                to:
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {consentRequest.requested_scope?.map(scope => {
                const scopeInfo = scopes[scope];
                if (!scopeInfo && scope === 'openid') return null;
                if (!scopeInfo)
                  return (
                    <div
                      key={scope}
                      className="permission-item px-4 py-3 flex items-center"
                    >
                      <BiIdCard className="w-4 h-4 text-purple-600 mr-3" />
                      <span className="text-sm text-gray-700">
                        {scope} (unknown scope)
                      </span>
                    </div>
                  );
                return (
                  <div
                    key={scope}
                    className="permission-item px-4 py-3 flex items-center"
                  >
                    {scopeInfo.icon}
                    <span className="text-sm text-gray-700">
                      {scopeInfo.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center mb-6">
            No specific permissions requested
          </div>
        )}

        <form method="post" action={`/api/consent`}>
          <input
            type="hidden"
            name="consent_challenge"
            value={consentRequest.challenge}
          />
          <div className="flex justify-between items-center mb-6 mt-6">
            <button
              name="action"
              value="reject"
              type="submit"
              className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
            >
              <i className="w-4 h-4 mr-1" data-feather="chevron-left" />
              Reject
            </button>
            <button
              name="action"
              value="accept"
              type="submit"
              className="cursor-pointer py-3 px-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg cursor-pointer"
            >
              Authorize
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 card-background">or</span>
          </div>
        </div>

        <div className="text-center">
          <a
            href={`/api/logout?consent_challenge=${challenge}`}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center"
          >
            <MdLogout className="w-4 h-4 mr-1" />
            Switch Account
          </a>
        </div>
      </div>
    </div>
  );
}
