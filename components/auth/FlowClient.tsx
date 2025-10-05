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
import { ErrorGeneric, OAuth2LoginRequest } from '@ory/kratos-client';
import Loading from '../ui/Loading';
import { getRequestDomain } from '@/lib/ory/form-labels';

export enum FlowType {
  LOGIN = 'login',
  REGISTRATION = 'registration',
  SETTINGS = 'settings',
  RECOVERY = 'recovery',
  VERIFICATION = 'verification',
}

export default function FlowClient({
  flowType,
  loginChallenge,
  flow,
  oauth2LoginRegister,
}: {
  flowType: FlowType;
  loginChallenge?: string;
  flow?: string;
  oauth2LoginRegister?: OAuth2LoginRequest;
}) {
  const {
    data: flowData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: flow
      ? [flowType, 'byFlow', flow]
      : loginChallenge
        ? [flowType, 'byChallenge', loginChallenge]
        : [flowType, 'local'],
    queryFn: () => {
      if (flowType === FlowType.LOGIN) {
        if (flow) return getLoginFlow(flow);
        return createBrowserLoginFlow(loginChallenge);
      } else if (flowType === FlowType.REGISTRATION) {
        if (flow) return getRegistrationFlow(flow);
        return createBrowserRegistrationFlow(loginChallenge);
      }
    },
  });

  useEffect(() => {
    console.log(
      'LoginFlowClient',
      JSON.stringify({ loginChallenge, flow, flowData }, null, 2),
    );
  }, [flowData]);

  if (isLoading) return <Loading />;

  if (isError) return <Error error={error as AxiosError<ErrorGeneric>} />;

  if (!flowData)
    return (
      <Error
        error={new AxiosError('Flow data is undefined', 'flow-data-undefined')}
      />
    );

  const oauth2Client =
    oauth2LoginRegister?.client || flowData?.oauth2_login_request?.client;

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {flowType === FlowType.LOGIN
            ? 'Sign in to continue'
            : 'Create your account'}
        </h1>
        {flowData.oauth2_login_request?.request_url && (
          <p className="text-gray-600 text-sm">
            You will be redirected to{' '}
            <span className="font-semibold gradient-text text-transparent bg-clip-text">
              {getRequestDomain(flowData.oauth2_login_request?.request_url)}
            </span>
          </p>
        )}
      </div>

      <Form flow={flowData} />
    </>
  );
}
