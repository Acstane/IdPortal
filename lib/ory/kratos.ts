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
  const opts =
    cookieHeader || returnTo ? { cookie: cookieHeader, returnTo } : undefined;
  const logout = await kratosFrontend.createBrowserLogoutFlow(opts);
  return logout.data;
}

export async function createBrowserLoginFlow(loginChallenge?: string) {
  const opts = loginChallenge ? { loginChallenge } : undefined;
  const flow = await kratosFrontend.createBrowserLoginFlow(opts);
  return flow.data;
}

export async function getLoginFlow(flowId: string) {
  const flow = await kratosFrontend.getLoginFlow({ id: flowId });
  return flow.data;
}

export async function createBrowserRegistrationFlow(loginChallenge?: string) {
  const opts = loginChallenge ? { loginChallenge } : undefined;
  const flow = await kratosFrontend.createBrowserRegistrationFlow(opts);
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
