'use client';
import { Form } from '@/components/ui/Form';
import {
  createBrowserRegistrationFlow,
  getRegistrationFlow,
} from '@/lib/ory/kratos';
import { LoginFlow } from '@ory/kratos-client';
import * as React from 'react';

export default function RegisterPage() {
  const [registrationFlow, setRegistrationFlow] =
    React.useState<LoginFlow | null>(null);

  React.useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const challenge = params.get('login_challenge');
      const flowId = params.get('flow');

      if (flowId) {
        const flow = await getRegistrationFlow(flowId);
        setRegistrationFlow(flow);
        return;
      }

      const flow = await createBrowserRegistrationFlow(challenge);
      setRegistrationFlow(flow);
    };

    init();
  }, []);

  if (!registrationFlow) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Registration Page</h1>
      <p>
        Please register to continue to{' '}
        {registrationFlow.oauth2_login_request?.client?.client_name}
      </p>
      <pre>{JSON.stringify(registrationFlow, null, 2)}</pre>

      <Form flow={registrationFlow} />

      <p>
        Already have an account?{' '}
        <a
          href={`/login?login_challenge=${registrationFlow.oauth2_login_challenge}`}
        >
          Login here
        </a>
      </p>
    </div>
  );
}
