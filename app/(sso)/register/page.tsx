import FlowClient, { FlowType } from '@/components/auth/FlowClient';
import { getOAuth2LoginRequest } from '@/lib/ory/hydra';

interface RegisterPageProps {
  searchParams: Promise<{ login_challenge?: string; flow?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { login_challenge, flow } = await searchParams;

  const oauth2LoginRegister = login_challenge
    ? await getOAuth2LoginRequest(login_challenge)
    : undefined;

  return (
    <>
      <FlowClient
        flowType={'registration' as FlowType}
        loginChallenge={login_challenge}
        flow={flow}
        oauth2LoginRegister={oauth2LoginRegister}
      />
    </>
  );
}
