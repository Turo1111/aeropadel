'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import ModalLoading from "@/components/ModalLoading";
import Alert from "@/components/Alert";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true} style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SessionProvider>
          <Provider store={store}>
            <AppWrapper>{children}</AppWrapper>
            <ModalLoading />
            <Alert />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}

// Componente para controlar la redirección y autenticación
function AppWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado o no está activo y no está en login, lo mandamos al login
    if ((status === "unauthenticated" || (session?.user && !session.user.isActive)) && pathname !== "/") {
      console.log('🔴 Usuario no autenticado o inactivo intentando acceder a:', pathname);
      console.log('Redirigiendo a /');
      if (session?.user && !session.user.isActive) {
        signOut({ redirect: false });
      }
      router.push("/");
    }
  }, [status, session, pathname, router]);

  useEffect(() => {
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ["/"];
    
    // Si está autenticado y activo y trata de acceder a rutas públicas, redirigir al dashboard
    if (status === "authenticated" && session?.user?.isActive && publicRoutes.includes(pathname)) {
      console.log('🟢 Usuario autenticado y activo intentando acceder a ruta pública:', pathname);
      console.log('Redirigiendo a /dashboard/inicio');
      router.push("/dashboard/inicio");
    }
  }, [status, session, pathname, router]);

  // Si estamos en login o register, no mostramos nada adicional
  if (pathname === "/") {
    console.log('📝 Mostrando página de login/register');
    return <>{children}</>;
  }

  // Si aún se está cargando la sesión, no mostramos nada
  if (status === "loading") {
    console.log('⏳ Cargando sesión...');
    return null;
  }

  // Si está autenticado y activo, mostramos el contenido
  if (session?.user?.isActive) {
    console.log('✅ Usuario autenticado y activo, mostrando contenido para:', pathname);
    return <>{children}</>;
  }

  // Si está autenticado pero inactivo, cerrar sesión y redirigir al login
  if (session?.user && !session.user.isActive) {
    console.log('❌ Usuario inactivo, cerrando sesión');
    signOut({ redirect: false });
    router.push("/");
    return null;
  }

  return null;
}
