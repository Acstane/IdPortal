'use client';

import { useQuery } from '@tanstack/react-query';
import {
  createBrowserRegistrationFlow,
  getRegistrationFlow,
} from '@/lib/ory/kratos';
import { Form } from '../ui/Form';

export default function RegisterFlowClient({
  loginChallenge,
  flow,
}: {
  loginChallenge?: string;
  flow?: string;
}) {
  const {
    data: registrationFlow,
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
      if (flow) return getRegistrationFlow(flow);
      if (loginChallenge) return createBrowserRegistrationFlow(loginChallenge);
      return createBrowserRegistrationFlow(undefined);
    },
    retry: 2,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div>
        <h1>Register Page</h1>
        <div>Loading registration flow...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1>Register Page</h1>
        <div>Error: {error.message}</div>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Register Page</h1>
      <p>
        Please register to continue to{' '}
        {registrationFlow?.oauth2_login_request?.client?.client_name}
      </p>

      <Form flow={registrationFlow!} />

      <pre>{JSON.stringify(registrationFlow, null, 2)}</pre>
    </div>
  );
}
