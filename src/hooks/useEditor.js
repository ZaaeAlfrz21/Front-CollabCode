import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useEditor = (roomId) => {
    const { socket } = useSocket(); 
    const { user } = useAuth(); 
    
    // Default value kosong agar terlihat bersih saat loading
    const [code, setCode] = useState("// Loading...");
    
    // Ref untuk mencegah loop (echo) antara socket vs ketikan sendiri
    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        if (!socket || !roomId) return;

        // 1. Ambil data awal (API)
        const fetchInitialCode = async () => {
            try {
                // Konfigurasi Header jika user login
                const config = user?.token ? {
                    headers: { Authorization: `Bearer ${user.token}` }
                } : {};
                
                // Gunakan URL lengkap untuk menghindari masalah env variable di Vite
                const baseURL = 'celebrated-analysis-production-7785.up.railway.app'; 
                const res = await axios.get(`${baseURL}/api/rooms/${roomId}`, config);
                
                // Jika berhasil load
                isRemoteUpdate.current = true;
                // Ambil content, atau string kosong jika null
                setCode(res.data.content || ""); 
                
            } catch (error) {
                console.error("Info: Gagal load room (Mungkin room baru)", error);
                
                // --- PERBAIKAN PENTING DISINI ---
                // Jika error 404 (Not Found) atau 500 (Server Error),
                // Kita anggap ini ROOM BARU. Jangan set error text, biarkan kosong
                // agar user bisa langsung coding.
                isRemoteUpdate.current = true;
                setCode(""); // Set kosong agar siap dipakai
            } finally {
                // Reset flag setelah render selesai
                setTimeout(() => { isRemoteUpdate.current = false; }, 100);
            }
        };

        fetchInitialCode();

        // 2. Dengar update kode dari user lain (Realtime)
        const handleCodeUpdate = (newCode) => {
            // Cek: Jangan update jika kodenya sama persis (mencegah kedip kursor)
            setCode((currentCode) => {
                if (currentCode === newCode) return currentCode;
                
                isRemoteUpdate.current = true;
                return newCode;
            });
            
            // Reset flag remote update setelah jeda singkat
            setTimeout(() => { isRemoteUpdate.current = false; }, 100);
        };

        socket.on('code-update', handleCodeUpdate);

        return () => {
            socket.off('code-update', handleCodeUpdate);
        };
    }, [socket, roomId, user]);

    // Fungsi yang dipanggil saat KITA mengetik di Editor
    const handleCodeChange = (newCode) => {
        // Jika perubahan ini dipicu oleh setCode dari socket/API, abaikan emit
        if (isRemoteUpdate.current) {
            return;
        }

        setCode(newCode);
        
        // Emit ke socket agar teman melihat perubahan
        if (socket) {
            socket.emit('code-change', { roomId, code: newCode });
        }
    };

    return { code, handleCodeChange };
};

export default useEditor;
