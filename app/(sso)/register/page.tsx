import RegisterFlowClient from '@/components/auth/RegisterFlowClient';

interface RegisterPageProps {
  searchParams: Promise<{ login_challenge?: string; flow?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { login_challenge, flow } = await searchParams;

  return (
    <div>
      <h1>Register</h1>
      <RegisterFlowClient loginChallenge={login_challenge} flow={flow} />
    </div>
  );
}
