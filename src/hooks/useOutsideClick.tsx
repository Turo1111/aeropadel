/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>, // El ref debe ser un React.RefObject que apunta a un elemento HTML
  callback: () => void
) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
