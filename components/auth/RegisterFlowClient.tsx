'use client';

import { useQuery } from '@tanstack/react-query';
import {
  createBrowserLoginFlow,
  createBrowserRegistrationFlow,
  getLoginFlow,
  getRegistrationFlow,
} from '@/lib/ory/kratos';
import { Form } from '../ui/Form';
import { useEffect } from 'react';
import { Error } from '../ui/Error';
import { AxiosError } from 'axios';
import { ErrorGeneric } from '@ory/kratos-client';
import Loading from '../ui/Loading';
import { OAuth2LoginRequest } from '@ory/hydra-client';
import { useState } from 'react';
import { getRequestDomain } from '@/lib/ory/form-labels';

export default function LoginFlowClient({
  loginChallenge,
  flow,
  loginRequest,
}: {
  loginChallenge?: string;
  flow?: string;
  loginRequest?: OAuth2LoginRequest;
}) {
  const {
    data: registrationFlow,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: flow
      ? ['registrationFlow', 'byFlow', flow]
      : loginChallenge
        ? ['registrationFlow', 'byChallenge', loginChallenge]
        : ['registrationFlow', 'local'],
    queryFn: () => {
      if (flow) return getRegistrationFlow(flow);
      if (loginChallenge) return createBrowserRegistrationFlow(loginChallenge);
      return createBrowserRegistrationFlow();
    },
  });

  const [Oauth2LoginRequestUrl, setOauth2LoginRequestUrl] = useState(
    loginRequest?.request_url,
  );

  useEffect(() => {
    console.log(
      'RegistrationFlowClient',
      JSON.stringify({ loginChallenge, flow, registrationFlow }, null, 2),
    );

    setOauth2LoginRequestUrl(
      registrationFlow?.oauth2_login_request?.request_url ||
        loginRequest?.request_url,
    );
  }, [registrationFlow]);

  if (isLoading) return <Loading />;

  if (isError) return <Error error={error as AxiosError<ErrorGeneric>} />;

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create an account to continue
        </h1>
        {Oauth2LoginRequestUrl && (
          <p className="text-gray-600 text-sm">
            You will be redirected to{' '}
            <span className="font-semibold gradient-text text-transparent bg-clip-text">
              {getRequestDomain(Oauth2LoginRequestUrl)}
            </span>
          </p>
        )}
      </div>

      <Form flow={registrationFlow!} />
    </>
  );
}
