'use client'
import Dashboard from '@/components/dashboard/Dashboard';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function DashboardLayout({children}: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado o no está activo, cerrar sesión y redirigir al login
    if (status === "unauthenticated" || (session?.user && !session.user.isActive)) {
      if (session?.user && !session.user.isActive) {
        signOut({ redirect: false });
      }
      router.push("/");
    }
  }, [status, session, router]);

  // Si está cargando, no autenticado o no está activo, no mostrar nada
  if (status === "loading" || status === "unauthenticated" || (session?.user && !session.user.isActive)) {
    return null;
  }

  return (
    <Provider store={store}>
      <Dashboard>
        {children}
      </Dashboard>
    </Provider>
  );
}
