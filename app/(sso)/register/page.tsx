import RegisterFlowClient from '@/components/auth/RegisterFlowClient';
import { getOAuth2LoginRequest } from '@/lib/ory/hydra';

interface RegisterPageProps {
  searchParams: Promise<{ login_challenge?: string; flow?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { login_challenge, flow } = await searchParams;

  const loginRequest =
    login_challenge && login_challenge !== 'undefined'
      ? await getOAuth2LoginRequest(login_challenge)
      : undefined;

  return (
    <>
      <RegisterFlowClient
        loginChallenge={login_challenge}
        flow={flow}
        loginRequest={loginRequest}
      />
    </>
  );
}
