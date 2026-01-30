import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // --- PERHATIKAN URL INI ---
        // Pastikan URL ini SAMA PERSIS dengan yang ada di Dashboard Railway Backend.
        // Jika di dashboard URL-nya pendek (celebrated-analysis.up.railway.app), PAKAI YANG ITU.
        // Jangan sampai beda satu huruf pun.
        const URL = 'https://collaabcode-production.up.railway.app'; 

        const newSocket = io(URL, {
            transports: ['websocket'], 
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            withCredentials: true // ✅ TAMBAHKAN INI (Wajib jika backend credentials: true)
        });

        setSocket(newSocket);

        // Debugging Client Side
        newSocket.on('connect', () => {
            console.log('✅ Socket Connected to Server:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err);
            // Tips: Jika error 404, berarti URL salah.
            // Tips: Jika error websocket connection failed, coba hapus transports: ['websocket'] biarkan default.
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
