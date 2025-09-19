"use client";
import { Form } from "@/components/ui/Form";
import { createBrowserLoginFlow, getLoginFlow } from "@/lib/ory/kratos";
import { LoginFlow, UiNode, UiNodeInputAttributes, UiNodeTypeEnum } from "@ory/kratos-client";
import * as React from "react";

export default function LoginPage() {
    const [loginChallenge, setLoginChallenge] = React.useState<string | null>(null);
    const [loginFlow, setLoginFlow] = React.useState<LoginFlow | null>(null);

    React.useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const challenge = params.get("login_challenge");
            const flowId = params.get("flow");

            if (flowId) {
                const flow = await getLoginFlow(flowId);
                setLoginFlow(flow);

                if (flow.oauth2_login_challenge) {
                    const newParams = new URLSearchParams(window.location.search);
                    newParams.set("flow", flowId);
                    newParams.set("login_challenge", flow.oauth2_login_challenge || "");
                    setLoginChallenge(flow.oauth2_login_challenge);
                }
                return;
            }

            const flow = await createBrowserLoginFlow(challenge);
            setLoginFlow(flow);
            setLoginChallenge(challenge);
        };

        init();
    }, []);


    if (!loginFlow) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Login Page</h1>
            <p>Please log in to continue to {loginFlow.oauth2_login_request?.client?.client_name}</p>
            <pre>{JSON.stringify(loginFlow, null, 2)}</pre>

            <Form flow={loginFlow} />
        </div>
    );
}