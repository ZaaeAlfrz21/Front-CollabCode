import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // --- BAGIAN PENTING: Mengambil URL dari .env ---
    // Jika pakai VITE, gunakan import.meta.env.VITE_API_URL
    // Jika pakai CRA (React Scripts), ganti jadi process.env.REACT_APP_API_URL
    const API_URL = import.meta.env.VITE_API_URL || "https://celebrated-analysis-production-7785.up.railway.app"; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gunakan API_URL yang dinamis, bukan localhost
            const res = await axios.post(`https://celebrated-analysis-production-7785.up.railway.app/api/auth/login`, { email, password });
            
            const { token, user } = res.data; 

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user)); 

            login(user, token);
            navigate('/'); 

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login Gagal. Cek email dan password Anda.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: 'white' }}>
            <form onSubmit={handleSubmit} style={{ background: '#252526', padding: '40px', borderRadius: '8px', width: '300px', border: '1px solid #3e3e42' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Login</h2>
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: 'none' }}
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: 'none' }}
                />
                
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
                
                <p style={{ marginTop: '15px', fontSize: '0.8rem', textAlign: 'center' }}>
                    Belum punya akun? <Link to="/register" style={{ color: '#007acc' }}>Daftar</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
