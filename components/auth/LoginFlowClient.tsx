'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserLoginFlow, getLoginFlow } from '@/lib/ory/kratos';
import { Form } from '../ui/Form';

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
    retry: 2,
    staleTime: 0,
  });

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
    <div>
      <h1>Login Page</h1>
      <p>
        Please log in to continue to{' '}
        {loginFlow?.oauth2_login_request?.client?.client_name}
      </p>

      <Form flow={loginFlow!} />

      <pre>{JSON.stringify(loginFlow, null, 2)}</pre>
    </div>
  );
}
