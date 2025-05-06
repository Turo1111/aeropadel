'use client'
import { clearAlert, getAlert } from '../redux/alertSlice';
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { useEffect } from "react";

export default function Alert() {

    const alert = useAppSelector(getAlert);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (alert.open) {
          const timeout = setTimeout(() => {
            dispatch(clearAlert());
          }, 3000);
          
          return () => clearTimeout(timeout);
        } 
    }, [alert.open, dispatch]);

  return (
        <div style={
            {
              display: alert.open ? 'block' : 'none',
              backgroundColor:  alert.color ? alert.color : '#F7A4A4',
              flex: 1,
              padding: 15,
              position: 'absolute',
              borderRadius: 15,
              color: '#F9F5F6',
              textAlign: 'center',
              marginTop: 50,
              zIndex: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '600px'
            }
        } suppressHydrationWarning={true} >
            <h2 style={{ fontWeight: "bold", color: '#fff', fontSize: 14 }}>{alert.message || 'Esto es una alerta'}</h2>
        </div>
    )
}
