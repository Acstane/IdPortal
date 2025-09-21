import LoginFlowClient from '@/components/auth/LoginFlowClient';

interface LoginPageProps {
  searchParams: Promise<{ login_challenge?: string; flow?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { login_challenge, flow } = await searchParams;

  return (
    <div>
      <h1>Login</h1>
      <LoginFlowClient loginChallenge={login_challenge} flow={flow} />
    </div>
  );
}
