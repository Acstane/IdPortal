import { Configuration, FrontendApi } from "@ory/kratos-client";

const baseUrl = process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL;

const config = new Configuration({ basePath: baseUrl });

export const kratosFrontend = new FrontendApi(config);

export async function createBrowserLoginFlow(loginChallenge: string | null) {
    const flow = await kratosFrontend.createBrowserLoginFlow(loginChallenge ? {
        loginChallenge,
    } : {}, { withCredentials: true });
    return flow.data;
}

export async function getLoginFlow(flowId: string, csrf_token?: string) {
    const flow = await kratosFrontend.getLoginFlow({ id: flowId }, { withCredentials: true });
    return flow.data;
}

export async function createBrowserRegistrationFlow(loginChallenge: string | null) {
    const flow = await kratosFrontend.createBrowserRegistrationFlow(loginChallenge ? {
        loginChallenge,
    } : {}, { withCredentials: true });
    return flow.data;
}

export async function getRegistrationFlow(flowId: string) {
    const flow = await kratosFrontend.getRegistrationFlow({ id: flowId }, { withCredentials: true });
    return flow.data;
}

export async function getFlowError(errorId: string) {
    const error = await kratosFrontend.getFlowError({ id: errorId }, { withCredentials: true });
    return error.data;
}