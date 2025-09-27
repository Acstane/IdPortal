'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserLoginFlow, getLoginFlow } from '@/lib/ory/kratos';
import { Form } from '../ui/Form';
import { useEffect } from 'react';

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

  if (isLoading) {
    return (
      <div>
        <h1>Login Page</h1>
        <div>Loading login flow...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1>Login Page</h1>
        <div>Error: {error.message}</div>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

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
              {loginFlow.oauth2_login_request.client.client_name}
            </span>
          </p>
        )}
      </div>

      <Form flow={loginFlow!} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-500 card-background">
            Or continue with
          </span>
        </div>
      </div>
    </>
  );
}
