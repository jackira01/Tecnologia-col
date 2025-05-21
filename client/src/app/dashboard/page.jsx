import { auth } from '@/auth';
import Dashboard from '@/components/Dashboard/Dashboard';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  // Redirección en el servidor, antes de renderizar nada
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return <Dashboard />;
};

export default DashboardPage;
