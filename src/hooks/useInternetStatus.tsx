import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const useInternetStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const socket = io('http://localhost:3002', { transports: ['websocket'] });
    let timeoutId: NodeJS.Timeout;

    // Timeout de 15 segundos para considerar la conexión como caída
    timeoutId = setTimeout(() => {
      setIsConnected(false);
    }, 15000); // 15 segundos

    socket.on('connect', () => {
      clearTimeout(timeoutId); // Si se conecta antes de los 15 segundos, cancelar el timeout
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      clearTimeout(timeoutId);
      socket.disconnect();
    };
  }, []);

  return isConnected;
};

export default useInternetStatus;
