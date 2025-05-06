import { useEffect, useState } from 'react';

export const useResize = () => {
  const [ancho, setAncho] = useState<number>(0);
  const [alto, setAlto] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setAncho(window.innerWidth);
      setAlto(window.innerHeight);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Inicializar los valores de ancho y alto en el primer renderizado
      if (ancho === 0 || alto === 0) {
        handleResize();
      }

      // Cleanup event listener cuando el componente se desmonta
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [ancho, alto]);

  return { ancho, alto };
};
