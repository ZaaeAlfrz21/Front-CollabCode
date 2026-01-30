import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaUserCircle, FaSignOutAlt, FaArrowLeft, 
    FaEnvelope, FaIdBadge, FaCamera, FaSave 
} from 'react-icons/fa';
import axios from 'axios'; 

const API_URL = 'https://collaabcode-production.up.railway.app';

const UserPage = () => {
    // Ambil user, logout, dan login (untuk update state) dari Context
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Reset preview jika user berubah (misal setelah sukses upload)
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
        }
    }, [user, selectedFile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('profilePic', selectedFile);
        // Pastikan ID dikirim. Fallback ke user.id atau user._id
        formData.append('userId', user?.id || user?._id); 

        try {
            // 1. Upload ke Backend
            const res = await axios.post(`${API_URL}/api/auth/upload-profile`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // 2. Siapkan data user baru (gabungan data lama + foto baru)
            const updatedUser = { 
                ...user, 
                profilePicture: res.data.profilePicture 
            };
            
            // 3. Update Context & LocalStorage tanpa perlu login ulang
            // Kita gunakan fungsi login() untuk "merefresh" sesi user di aplikasi
            login(updatedUser, localStorage.getItem('token')); 

            alert("Foto berhasil diperbarui!");
            setSelectedFile(null); 
            setPreviewUrl(null); 

        } catch (error) {
            console.error("Upload gagal", error);
            alert("Gagal mengupload foto. " + (error.response?.data?.message || "Cek koneksi server."));
        } finally {
            setIsUploading(false);
        }
    };

    // Jika data user belum siap (misal baru refresh), tampilkan loading
    if (!user) return <div style={styles.container}>Loading data user...</div>;

    // Logic Url Gambar: Preview -> Gambar Database -> null
    const getProfileImageSrc = () => {
        if (previewUrl) return previewUrl;
        if (user.profilePicture) {
            // Pastikan path dari backend digabung dengan http://localhost:5000
            return `${API_URL}${user.profilePicture}`;
        }
        return null; 
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/')} style={styles.backBtn}>
                    <FaArrowLeft style={{marginRight: '8px'}}/> Kembali ke Dashboard
                </button>
            </div>

            <div style={styles.card}>
                {/* --- AREA FOTO PROFIL --- */}
                <div style={styles.avatarContainer}>
                    <div style={styles.imageWrapper}>
                        {getProfileImageSrc() ? (
                            <img 
                                src={getProfileImageSrc()} 
                                alt="Profile" 
                                style={styles.profileImg} 
                                onError={(e) => { 
                                    e.target.onerror = null; // Mencegah loop
                                    e.target.src = ''; // Hapus src jika 404
                                    // Opsional: tampilkan icon default jika error
                                }} 
                            />
                        ) : (
                            <FaUserCircle size={100} color="#007acc" />
                        )}
                        
                        <label htmlFor="fileInput" style={styles.cameraIcon}>
                            <FaCamera size={16} color="white" />
                        </label>
                        <input 
                            id="fileInput" 
                            type="file" 
                            accept="image/*" 
                            style={{display: 'none'}} 
                            onChange={handleFileChange}
                        />
                    </div>

                    {selectedFile && (
                        <button 
                            onClick={handleUpload} 
                            style={styles.savePhotoBtn} 
                            disabled={isUploading}
                        >
                            {isUploading ? 'Mengupload...' : <><FaSave/> Simpan Foto</>}
                        </button>
                    )}
                </div>

                {/* --- INFORMASI USER --- */}
                <h2 style={styles.username}>{user.username}</h2>
                <span style={styles.roleBadge}>User</span>

                <div style={styles.infoSection}>
                    <div style={styles.infoRow}>
                        <div style={styles.iconBox}><FaEnvelope color="#ccc"/></div>
                        <div style={styles.infoText}>
                            <span style={styles.label}>Email Address</span>
                            <span style={styles.value}>{user.email}</span>
                        </div>
                    </div>

                    <div style={styles.infoRow}>
                        <div style={styles.iconBox}><FaIdBadge color="#ccc"/></div>
                        <div style={styles.infoText}>
                            <span style={styles.label}>User ID</span>
                            <span style={styles.value}>{user.id || user._id}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.divider}></div>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <FaSignOutAlt style={{marginRight: '8px'}}/> Logout
                </button>
            </div>
        </div>
    );
};

// Styles tetap sama seperti kode Anda
const styles = {
    container: { minHeight: '100vh', background: '#1e1e1e', color: '#ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', fontFamily: 'Consolas, monospace' },
    header: { width: '100%', maxWidth: '450px', marginBottom: '15px', display: 'flex' },
    backBtn: { background: 'transparent', border: 'none', color: '#007acc', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', padding: 0, fontWeight: 'bold' },
    card: { background: '#252526', width: '90%', maxWidth: '450px', borderRadius: '12px', padding: '30px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #333' },
    avatarContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' },
    imageWrapper: { position: 'relative', width: '100px', height: '100px', marginBottom: '10px' },
    profileImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #007acc' },
    cameraIcon: { position: 'absolute', bottom: '0', right: '0', background: '#007acc', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #252526' },
    savePhotoBtn: { marginTop: '10px', background: '#4caf50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' },
    username: { color: 'white', margin: '5px 0', fontSize: '22px', fontWeight: '600' },
    roleBadge: { background: '#333', color: '#007acc', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', marginBottom: '25px', border: '1px solid #444' },
    infoSection: { width: '100%', marginBottom: '20px' },
    infoRow: { display: 'flex', alignItems: 'center', background: '#1e1e1e', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #333' },
    iconBox: { width: '30px', display: 'flex', justifyContent: 'center' },
    infoText: { display: 'flex', flexDirection: 'column', marginLeft: '10px' },
    label: { fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
    value: { fontSize: '14px', color: '#eee', fontWeight: '500' },
    divider: { width: '100%', height: '1px', background: '#333', marginBottom: '25px' },
    logoutBtn: { background: 'transparent', color: '#d9534f', border: '1px solid #d9534f', padding: '10px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }
};

export default UserPage;
