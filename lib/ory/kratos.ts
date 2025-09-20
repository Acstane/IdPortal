import { Configuration, FrontendApi } from '@ory/kratos-client';
import { oryAxios } from './axios';

const baseUrl = process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL;

const config = new Configuration({ basePath: baseUrl });

export const kratosFrontend = new FrontendApi(config, undefined, oryAxios);

export async function getSession(cookieHeader?: string) {
  const session = await kratosFrontend.toSession(undefined, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
  return session.data;
}

export async function logout(cookieHeader?: string, returnTo?: string) {
  const logout = await kratosFrontend.createBrowserLogoutFlow({
    returnTo,
    cookie: cookieHeader,
  });
  return logout.data;
}

export async function createBrowserLoginFlow(loginChallenge: string | null) {
  const flow = await kratosFrontend.createBrowserLoginFlow(
    loginChallenge
      ? {
          loginChallenge,
        }
      : {},
  );
  return flow.data;
}

export async function getLoginFlow(flowId: string) {
  const flow = await kratosFrontend.getLoginFlow({ id: flowId });
  return flow.data;
}

export async function createBrowserRegistrationFlow(
  loginChallenge: string | null,
) {
  const flow = await kratosFrontend.createBrowserRegistrationFlow(
    loginChallenge
      ? {
          loginChallenge,
        }
      : {},
  );
  return flow.data;
}

export async function getRegistrationFlow(flowId: string) {
  const flow = await kratosFrontend.getRegistrationFlow({ id: flowId });
  return flow.data;
}

export async function getFlowError(errorId: string) {
  const error = await kratosFrontend.getFlowError({ id: errorId });
  return error.data;
}
