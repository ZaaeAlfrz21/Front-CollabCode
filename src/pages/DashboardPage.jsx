import React, { useState } from 'react'; // Hapus useEffect jika tidak ambil data history
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaPlus, FaSearch, FaUserCircle, 
    FaFileCode, FaBars, FaJs, FaPython, FaHtml5, FaCss3Alt, FaSignInAlt 
} from 'react-icons/fa';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- STATE BARU UNTUK JOIN ROOM ---
    const [inputRoomId, setInputRoomId] = useState('');

    // --- ACTIONS ---
    const handleCreateNew = (type) => {
        const newRoomId = Math.random().toString(36).substring(2, 11);
        navigate(`/editor/${newRoomId}?lang=${type}`);
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (inputRoomId.trim()) {
            navigate(`/editor/${inputRoomId.trim()}`);
        }
    };

    const handleProfileClick = () => {
        navigate('/user');
    };

    return (
        <div style={styles.container}>
            
            {/* === NAVBAR === */}
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

                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <div onClick={handleProfileClick} style={styles.profileWrapper}>
                        <span style={styles.profileName}>{user?.username || 'User'}</span>
                        <FaUserCircle size={30} color="#007acc" />
                    </div>
                </div>
            </div>

            {/* === SECTION 1: CREATE NEW === */}
            <div style={styles.templateSection}>
                <div style={styles.contentWidth}>
                    <div style={styles.sectionHeader}>Mulai coding baru</div>
                    <div style={styles.templateGrid}>
                        <div style={styles.templateItem} onClick={() => handleCreateNew('javascript')}>
                            <div style={styles.cardPreview}><FaPlus size={32} color="#fff" /></div>
                            <span style={styles.cardTitle}>Blank Project</span>
                        </div>
                        <div style={styles.templateItem} onClick={() => handleCreateNew('javascript')}>
                            <div style={styles.cardPreview}><FaJs size={36} color="#f7df1e" /></div>
                            <span style={styles.cardTitle}>JavaScript</span>
                        </div>
                        <div style={styles.templateItem} onClick={() => handleCreateNew('html')}>
                            <div style={styles.cardPreview}><FaHtml5 size={36} color="#e34c26" /></div>
                            <span style={styles.cardTitle}>HTML</span>
                        </div>
                        <div style={styles.templateItem} onClick={() => handleCreateNew('css')}>
                            <div style={styles.cardPreview}><FaCss3Alt size={36} color="#264de4" /></div>
                            <span style={styles.cardTitle}>CSS</span>
                        </div>
                        <div style={styles.templateItem} onClick={() => handleCreateNew('python')}>
                            <div style={styles.cardPreview}><FaPython size={36} color="#306998" /></div>
                            <span style={styles.cardTitle}>Python</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === SECTION 2: JOIN ROOM (MENGGANTIKAN HISTORY) === */}
            <div style={styles.joinSection}>
                <div style={styles.contentWidth}>
                    <div style={styles.joinCard}>
                        <div style={styles.joinIconArea}>
                            <FaSignInAlt size={40} color="#007acc" />
                        </div>
                        <h2 style={styles.joinTitle}>Gabung ke Ruang Kolaborasi</h2>
                        <p style={styles.joinSubtitle}>Masukkan Room ID untuk mulai coding bersama teman secara realtime.</p>
                        
                        <form onSubmit={handleJoinRoom} style={styles.joinForm}>
                            <input 
                                type="text" 
                                placeholder="Masukkan Room ID (Contoh: abc-123-xyz)" 
                                style={styles.joinInput}
                                value={inputRoomId}
                                onChange={(e) => setInputRoomId(e.target.value)}
                                required
                            />
                            <button type="submit" style={styles.joinButton}>
                                Join Room
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', color: '#ccc', fontFamily: 'Consolas, monospace' },
    navbar: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#252526', borderBottom: '1px solid #333' },
    logoArea: { display: 'flex', alignItems: 'center', gap: '10px' },
    searchBar: { display: 'flex', alignItems: 'center', background: '#3c3c3c', padding: '0 15px', borderRadius: '5px', width: '40%', height: '35px', border: '1px solid #555' },
    searchInput: { border: 'none', background: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', color: 'white' },
    profileWrapper: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    profileName: { fontSize: '14px', color: '#eee' },
    contentWidth: { maxWidth: '1000px', margin: '0 auto', width: '100%' },
    templateSection: { background: '#2d2d2d', padding: '25px 0 35px 0', borderBottom: '1px solid #333' },
    sectionHeader: { marginBottom: '15px', padding: '0 15px', fontSize: '16px', color: '#eee' },
    templateGrid: { display: 'flex', gap: '20px', padding: '0 15px' },
    templateItem: { cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '120px', alignItems: 'center' },
    cardPreview: { height: '140px', width: '100%', background: '#1e1e1e', border: '1px solid #444', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
    cardTitle: { fontSize: '13px', fontWeight: 'bold' },
    
    // --- STYLES BARU UNTUK JOIN ROOM ---
    joinSection: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' },
    joinCard: { background: '#252526', border: '1px solid #333', borderRadius: '12px', padding: '40px', textAlign: 'center', width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    joinIconArea: { marginBottom: '20px' },
    joinTitle: { color: '#fff', fontSize: '22px', marginBottom: '10px' },
    joinSubtitle: { color: '#888', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' },
    joinForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
    joinInput: { background: '#1e1e1e', border: '1px solid #555', padding: '12px 15px', borderRadius: '6px', color: '#fff', fontSize: '16px', outline: 'none', textAlign: 'center' },
    joinButton: { background: '#007acc', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }
};

export default DashboardPage;
