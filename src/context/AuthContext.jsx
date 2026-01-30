import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Cek apakah ada token tersimpan saat aplikasi dibuka (Load User)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // Ambil string JSON user

        if (token && storedUser) {
            try {
                // Parse string JSON kembali menjadi objek agar data email & id bisa dibaca
                const parsedUser = JSON.parse(storedUser);
                setUser({ ...parsedUser, token });
            } catch (error) {
                console.error("Gagal parsing data user", error);
                localStorage.removeItem('user'); // Hapus jika data rusak
            }
        }
    }, []);

    // Fungsi Login: Terima data lengkap dari Backend
    const login = (userData, token) => {
        // userData sekarang berisi: { _id, username, email, profilePicture }
        
        localStorage.setItem('token', token);
        
        // PENTING: Simpan seluruh object user sebagai JSON string
        // Supaya email & id tidak hilang saat refresh
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        setUser({ ...userData, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Hapus data user lengkap
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);