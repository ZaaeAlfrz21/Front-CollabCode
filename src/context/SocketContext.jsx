import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // 1. Inisialisasi Socket
        // Ganti URL jika backend kamu bukan di port 5000
        const newSocket = io('celebrated-analysis-production-7785.up.railway.app', {
            transports: ['websocket'], // Paksa pakai websocket agar stabil
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        // Debugging Client Side
        newSocket.on('connect', () => {
            console.log('✅ Socket Connected to Server:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err);
        });

        // Cleanup saat aplikasi ditutup
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
