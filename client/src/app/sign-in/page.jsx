import { auth } from '@/auth';
import AuthFormGoogle from '@/components/AuthForm/AuthFormGoogle';
import { redirect } from 'next/navigation';

const SignIn = async () => {
  const session = await auth();
  // Redirección en el servidor, antes de renderizar nada
  if (session) return redirect('/');
  return <AuthFormGoogle />;
};

export default SignIn;
