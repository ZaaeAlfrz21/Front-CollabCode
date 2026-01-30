import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('celebrated-analysis-production-7785.up.railway.app/api/auth/register', { username, email, password });
            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Gagal Daftar");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: 'white' }}>
            <form onSubmit={handleSubmit} style={{ background: '#252526', padding: '40px', borderRadius: '8px', width: '300px', border: '1px solid #3e3e42' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
                <input 
                    type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: 'none' }}
                />
                <input 
                    type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: 'none' }}
                />
                <input 
                    type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: 'none' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Daftar</button>
                <p style={{ marginTop: '15px', fontSize: '0.8rem', textAlign: 'center' }}>
                    Sudah punya akun? <Link to="/login" style={{ color: '#007acc' }}>Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
