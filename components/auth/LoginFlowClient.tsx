'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserLoginFlow, getLoginFlow } from '@/lib/ory/kratos';
import { Form } from '../ui/Form';
import { useEffect } from 'react';
import { Error } from '../ui/Error';
import { AxiosError } from 'axios';
import { ErrorGeneric } from '@ory/kratos-client';
import Loading from '../ui/Loading';
import { getRequestDomain } from '@/lib/ory/form-labels';

export default function LoginFlowClient({
  loginChallenge,
  flow,
}: {
  loginChallenge?: string;
  flow?: string;
}) {
  const {
    data: loginFlow,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: flow
      ? ['loginFlow', 'byFlow', flow]
      : loginChallenge
        ? ['loginFlow', 'byChallenge', loginChallenge]
        : ['loginFlow', 'local'],
    queryFn: () => {
      if (flow) return getLoginFlow(flow);
      if (loginChallenge) return createBrowserLoginFlow(loginChallenge);
      return createBrowserLoginFlow();
    },
  });

  useEffect(() => {
    console.log(
      'LoginFlowClient',
      JSON.stringify({ loginChallenge, flow, loginFlow }, null, 2),
    );
  }, [loginFlow]);

  if (isLoading) return <Loading />;

  if (isError) return <Error error={error as AxiosError<ErrorGeneric>} />;

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Sign in to continue
        </h1>
        {loginFlow?.oauth2_login_request?.client?.client_name && (
          <p className="text-gray-600 text-sm">
            You will be redirected to{' '}
            <span className="font-semibold gradient-text text-transparent bg-clip-text">
              {getRequestDomain(loginFlow.oauth2_login_request.request_url)}
            </span>
          </p>
        )}
      </div>

      <Form flow={loginFlow!} />
    </>
  );
}
