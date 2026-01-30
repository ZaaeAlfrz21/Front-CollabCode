import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaPlus, FaSearch, FaUserCircle, FaEllipsisV, 
    FaFileCode, FaBars, FaJs, FaPython, FaHtml5, FaCss3Alt, FaClock 
} from 'react-icons/fa';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Hapus 'logout' dari sini karena tidak dipakai di halaman ini lagi
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 1. SETUP DATA ---
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // MOCK DATA
                setHistory([
                    { roomId: 'web-landing', title: 'Landing Page HTML', lang: 'html', lastOpened: new Date() },
                    { roomId: 'style-main', title: 'Style.css Utama', lang: 'css', lastOpened: new Date(Date.now() - 3600000) },
                    { roomId: 'algo-sort', title: 'Algoritma Sorting', lang: 'javascript', lastOpened: new Date(Date.now() - 86400000) },
                    { roomId: 'data-py', title: 'Data Analysis', lang: 'python', lastOpened: new Date(Date.now() - 172800000) },
                ]);
            } catch (error) {
                console.error("Gagal load history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchHistory();
    }, [user]);

    // --- 2. ACTIONS ---
    const handleCreateNew = (type) => {
        const newRoomId = Math.random().toString(36).substring(2, 11);
        navigate(`/editor/${newRoomId}?lang=${type}`);
    };

    const handleOpenRoom = (roomId) => {
        navigate(`/editor/${roomId}`);
    };

    // FUNGSI BARU: Pindah ke halaman User/Profil
    const handleProfileClick = () => {
        navigate('/user');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getIconByLang = (lang) => {
        switch(lang) {
            case 'javascript': return <FaJs size={40} color="#f7df1e" />;
            case 'python': return <FaPython size={40} color="#306998" />;
            case 'html': return <FaHtml5 size={40} color="#e34c26" />;
            case 'css': return <FaCss3Alt size={40} color="#264de4" />;
            default: return <FaFileCode size={40} color="#ccc" />;
        }
    };

    return (
        <div style={styles.container}>
            
            {/* === NAVBAR (Dark) === */}
            <div style={styles.navbar}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <FaBars size={20} color="#ccc" style={{cursor:'pointer'}} />
                    <div style={styles.logoArea}>
                        <FaFileCode size={24} color="#007acc" />
                        <span style={{fontSize: '20px', color: '#eee', fontWeight: 'bold'}}>CollabCode</span>
                    </div>
                </div>

                <div style={styles.searchBar}>
                    <FaSearch color="#888" />
                    <input 
                        type="text" 
                        placeholder="Cari project..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* BAGIAN KANAN: HANYA PROFIL (KLIK UNTUK KE USER PAGE) */}
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    {/* Tombol Logout dihapus dari sini */}
                    
                    <div 
                        onClick={handleProfileClick} 
                        style={styles.profileWrapper}
                        title="Klik untuk lihat profil & logout"
                    >
                        <span style={styles.profileName}>{user?.username || 'User'}</span>
                        <FaUserCircle size={30} color="#007acc" />
                    </div>
                </div>
            </div>

            {/* === SECTION 1: CREATE NEW === */}
            <div style={styles.templateSection}>
                <div style={styles.contentWidth}>
                    <div style={styles.sectionHeader}>
                        <span>Mulai coding baru</span>
                    </div>
                    
                    <div style={styles.templateGrid}>
                        {/* 1. BLANK */}
                        <div style={styles.templateItem} onClick={() => handleCreateNew('javascript')}>
                            <div style={styles.cardPreview} className="hover-card">
                                <FaPlus size={32} color="#fff" />
                            </div>
                            <span style={styles.cardTitle}>Blank Project</span>
                        </div>

                        {/* 2. JS */}
                        <div style={styles.templateItem} onClick={() => handleCreateNew('javascript')}>
                            <div style={styles.cardPreview} className="hover-card">
                                <FaJs size={36} color="#f7df1e" />
                            </div>
                            <span style={styles.cardTitle}>JavaScript</span>
                        </div>

                        {/* 3. HTML */}
                        <div style={styles.templateItem} onClick={() => handleCreateNew('html')}>
                            <div style={styles.cardPreview} className="hover-card">
                                <FaHtml5 size={36} color="#e34c26" />
                            </div>
                            <span style={styles.cardTitle}>HTML</span>
                        </div>

                        {/* 4. CSS */}
                        <div style={styles.templateItem} onClick={() => handleCreateNew('css')}>
                            <div style={styles.cardPreview} className="hover-card">
                                <FaCss3Alt size={36} color="#264de4" />
                            </div>
                            <span style={styles.cardTitle}>CSS</span>
                        </div>

                        {/* 5. PYTHON */}
                        <div style={styles.templateItem} onClick={() => handleCreateNew('python')}>
                            <div style={styles.cardPreview} className="hover-card">
                                <FaPython size={36} color="#306998" />
                            </div>
                            <span style={styles.cardTitle}>Python</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === SECTION 2: HISTORY LIST === */}
            <div style={styles.recentSection}>
                <div style={styles.contentWidth}>
                    <div style={styles.filterRow}>
                        <span style={{fontWeight: 'bold', fontSize: '16px'}}>Riwayat Coding</span>
                        <div style={{fontSize: '12px', color: '#aaa'}}>Terbaru ▼</div>
                    </div>

                    <div style={styles.docGrid}>
                        {history.map((doc, index) => (
                            <div key={index} style={styles.docCard} onClick={() => handleOpenRoom(doc.roomId)}>
                                <div style={styles.docPreview}>
                                    <div style={{opacity: 0.8}}>
                                        {getIconByLang(doc.lang)}
                                    </div>
                                    <div style={{fontSize: '10px', marginTop:'10px', color: '#888'}}>
                                        {doc.lang.toUpperCase()}
                                    </div>
                                </div>
                                <div style={styles.docInfo}>
                                    <div style={styles.docTitle}>{doc.title}</div>
                                    <div style={styles.docMeta}>
                                        <FaClock size={10} style={{marginRight: '6px'}}/>
                                        <span>{formatDate(doc.lastOpened)}</span>
                                        <FaEllipsisV style={{marginLeft: 'auto', color: '#888'}} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { 
        minHeight: '100vh', 
        display: 'flex', flexDirection: 'column', 
        background: '#1e1e1e', color: '#ccc', 
        fontFamily: 'Consolas, "Courier New", monospace' 
    },
    navbar: { 
        height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 20px', background: '#252526', borderBottom: '1px solid #333' 
    },
    logoArea: { display: 'flex', alignItems: 'center', gap: '10px' },
    searchBar: { 
        display: 'flex', alignItems: 'center', background: '#3c3c3c', 
        padding: '0 15px', borderRadius: '5px', width: '40%', height: '35px', border: '1px solid #555'
    },
    searchInput: { 
        border: 'none', background: 'transparent', marginLeft: '10px', 
        outline: 'none', width: '100%', color: 'white', fontSize: '14px'
    },
    
    // STYLE BARU: Wrapper Profil
    profileWrapper: {
        display: 'flex', alignItems: 'center', gap: '10px', 
        cursor: 'pointer', padding: '5px 10px', borderRadius: '20px', 
        border: '1px solid transparent', transition: '0.2s',
        ':hover': { background: '#333', borderColor: '#444' } // *Note: inline hover css agak terbatas di react native, tapi ok di web modern
    },
    profileName: { fontSize: '14px', fontWeight: '500', color: '#eee' },

    contentWidth: { maxWidth: '1000px', margin: '0 auto', width: '100%' },
    templateSection: { background: '#2d2d2d', padding: '25px 0 35px 0', borderBottom: '1px solid #333' },
    sectionHeader: { marginBottom: '15px', padding: '0 15px', fontSize: '16px', color: '#eee' },
    templateGrid: { display: 'flex', gap: '20px', padding: '0 15px', overflowX: 'auto' },
    templateItem: { cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '120px', alignItems: 'center' },
    cardPreview: { 
        height: '140px', width: '100%', background: '#1e1e1e', 
        border: '1px solid #444', borderRadius: '6px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        marginBottom: '10px' 
    },
    cardTitle: { fontSize: '13px', fontWeight: 'bold', color: '#ccc' },
    recentSection: { flex: 1, padding: '20px 0' },
    filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px 20px 15px', color: '#eee' },
    docGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', padding: '0 15px' },
    docCard: { 
        background: '#252526', border: '1px solid #333', borderRadius: '6px', 
        cursor: 'pointer', height: '220px', display: 'flex', flexDirection: 'column' 
    },
    docPreview: { 
        flex: 1, background: '#1e1e1e', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #333' 
    },
    docInfo: { padding: '12px', background: '#252526' },
    docTitle: { fontSize: '14px', fontWeight: 'bold', color: '#ddd', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    docMeta: { display: 'flex', alignItems: 'center', fontSize: '11px', color: '#888' }
};

export default DashboardPage;