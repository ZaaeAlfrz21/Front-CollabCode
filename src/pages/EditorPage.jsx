import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import useEditor from '../hooks/useEditor';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
// TAMBAHAN: Import FaDownload
import { FaArrowLeft, FaCopy, FaCheck, FaCircle, FaPaperPlane, FaUserCircle, FaBars, FaTimes, FaDownload } from 'react-icons/fa';

const EditorPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    
    // Ambil bahasa dari URL
    const [searchParams] = useSearchParams();
    const language = searchParams.get('lang') || 'javascript';

    const { socket } = useSocket();
    const { user } = useAuth();
    
    const { code, handleCodeChange } = useEditor(roomId);
    
    // State UI
    const [clients, setClients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [copied, setCopied] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const messagesEndRef = useRef(null);

    // --- SETUP LISTENER SOCKET ---
    useEffect(() => {
        if (!socket || !socket.connected || !user) return;

        const handleJoined = ({ clients }) => { setClients(clients); };
        const handleDisconnected = ({ socketId }) => { setClients((prev) => prev.filter((client) => client.socketId !== socketId)); };
        const handleReceiveMessage = (msgData) => {
            setMessages((prev) => [...prev, msgData]);
            setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        };

        socket.on('joined-users', handleJoined);
        socket.on('user-disconnected', handleDisconnected);
        socket.on('receive-message', handleReceiveMessage);

        socket.emit('join-room', { roomId, username: user.username });

        return () => {
            socket.off('joined-users', handleJoined);
            socket.off('user-disconnected', handleDisconnected);
            socket.off('receive-message', handleReceiveMessage);
            socket.emit('leave-room', roomId); 
        };
    }, [socket, socket?.connected, roomId, user]);

    // Logic Kirim Pesan
    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMsg.trim()) return;
        const msgData = {
            roomId,
            message: inputMsg,
            username: user?.username || 'Guest',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        socket.emit('send-message', msgData);
        setInputMsg('');
    };
    
    // Helper Copy ID
    const copyToClipboard = () => {
        const fullUrl = window.location.href;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- FITUR BARU: DOWNLOAD CODE ---
    const downloadCode = () => {
        // 1. Tentukan ekstensi file berdasarkan bahasa
        const extensionMap = {
            javascript: 'js',
            python: 'py',
            html: 'html',
            css: 'css',
            java: 'java',
            cpp: 'cpp',
            php: 'php'
        };
        const ext = extensionMap[language] || 'txt';

        // 2. Buat Blob (File virtual di memori browser)
        const blob = new Blob([code], { type: 'text/plain' });
        
        // 3. Buat link download sementara
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Nama file: code-ROOMID.js
        link.download = `collab-code-${roomId.slice(0,5)}.${ext}`;
        
        // 4. Klik link secara programatik
        document.body.appendChild(link);
        link.click();
        
        // 5. Bersihkan memori
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!user) return <div>Loading User...</div>;

    return (
        <div style={styles.container}>
            {/* === SIDEBAR === */}
            <div style={{
                ...styles.sidebar, 
                width: isSidebarOpen ? '280px' : '0px', 
                padding: isSidebarOpen ? '15px' : '0px',
                opacity: isSidebarOpen ? 1 : 0
            }}>
                <div style={{ minWidth: '250px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={styles.sidebarHeader}>
                        <h3 style={{margin:0}}>CollabRoom</h3>
                    </div>

                    {/* LIST USER */}
                    <div style={styles.usersSection}>
                        <h4 style={styles.sectionTitle}>Connected Users ({clients.length})</h4>
                        <div style={styles.userList}>
                            {clients.map((client) => (
                                <div key={client.socketId} style={styles.userItem}>
                                    <FaUserCircle size={24} style={{marginRight: '10px', color: '#007acc'}}/>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <span style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{client.username}</span>
                                        {client.username === user?.username && <span style={{fontSize: '0.7rem', color:'#aaa'}}>(You)</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CHAT */}
                    <div style={styles.chatSection}>
                        <h4 style={styles.sectionTitle}>Live Chat</h4>
                        <div style={styles.chatBox}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{marginBottom: '10px', textAlign: msg.username === user?.username ? 'right' : 'left'}}>
                                    <div style={{fontSize: '0.75rem', color: '#888', marginBottom: '2px'}}>
                                        {msg.username} <span style={{fontSize:'0.6rem'}}>• {msg.time}</span>
                                    </div>
                                    <div style={{
                                        display: 'inline-block', padding: '6px 10px', borderRadius: '8px',
                                        background: msg.username === user?.username ? '#007acc' : '#3e3e42',
                                        color: 'white', fontSize: '0.9rem', maxWidth: '90%', wordWrap: 'break-word', textAlign: 'left'
                                    }}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendMessage} style={styles.chatInputArea}>
                            <input type="text" placeholder="Ketik pesan..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} style={styles.chatInput}/>
                            <button type="submit" style={styles.chatSendBtn}><FaPaperPlane /></button>
                        </form>
                    </div>
                </div>
            </div>

            {/* === MAIN EDITOR AREA === */}
            <div style={styles.editorWrapper}>
                <div style={styles.header}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.toggleBtn}>
                            {isSidebarOpen ? <FaTimes/> : <FaBars/>}
                        </button>
                        <button onClick={() => navigate('/')} style={styles.backBtn}>
                            <FaArrowLeft style={{ marginRight: '8px' }} /> Back
                        </button>
                    </div>

                    <div style={styles.roomInfo}>
                        <span style={styles.langBadge}>{language.toUpperCase()}</span>
                        
                        <span style={{color: '#888', marginRight: '5px', fontSize: '0.8rem'}}>ID:</span>
                        <code style={styles.idCode}>{roomId.slice(0, 6)}...</code>
                        
                        {/* TOMBOL ACTIONS (COPY & DOWNLOAD) */}
                        <div style={{display:'flex', gap: '5px'}}>
                            <button onClick={copyToClipboard} style={styles.actionBtn} title="Copy Link Room">
                                {copied ? <FaCheck color="#28a745"/> : <FaCopy />}
                            </button>
                            
                            {/* --- TOMBOL DOWNLOAD BARU --- */}
                            <button onClick={downloadCode} style={styles.actionBtn} title="Download Code">
                                <FaDownload />
                            </button>
                        </div>
                    </div>

                    <div style={styles.status}>
                        <FaCircle size={10} color={socket?.connected ? "#28a745" : "#dc3545"} style={{marginRight:'6px'}}/>
                        <span style={{fontSize: '0.8rem'}}>{socket?.connected ? "Live" : "Connecting..."}</span>
                    </div>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                    <Editor
                        height="100%"
                        language={language} 
                        theme="vs-dark"
                        value={code}
                        onChange={handleCodeChange}
                        options={{ fontSize: 14, minimap: { enabled: true }, automaticLayout: true }}
                    />
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { height: '100vh', display: 'flex', background: '#1e1e1e', color: 'white', overflow: 'hidden' },
    sidebar: { background: '#252526', borderRight: '1px solid #3e3e42', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', overflow: 'hidden', whiteSpace: 'nowrap' },
    sidebarHeader: { paddingBottom: '15px', borderBottom: '1px solid #3e3e42', marginBottom: '15px', textAlign: 'center', color: '#007acc', marginTop: '15px' },
    sectionTitle: { fontSize: '0.85rem', textTransform: 'uppercase', color: '#888', marginBottom: '10px', marginTop: 0, paddingLeft: '5px' },
    usersSection: { flex: 1, overflowY: 'auto', marginBottom: '20px', padding: '0 5px' },
    userList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    userItem: { display: 'flex', alignItems: 'center', background: '#333', padding: '8px', borderRadius: '5px' },
    chatSection: { height: '45%', display: 'flex', flexDirection: 'column', borderTop: '1px solid #3e3e42', paddingTop: '15px' },
    chatBox: { flex: 1, overflowY: 'auto', background: '#1e1e1e', borderRadius: '5px', padding: '10px', marginBottom: '10px', fontSize: '0.9rem' },
    chatInputArea: { display: 'flex', gap: '5px' },
    chatInput: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #3e3e42', background: '#333', color: 'white', outline: 'none' },
    chatSendBtn: { background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', padding: '0 12px', cursor: 'pointer' },
    editorWrapper: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    header: { height: '50px', background: '#2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px', borderBottom: '1px solid #3e3e42' },
    toggleBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginRight: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center' },
    backBtn: { background: '#444', border: 'none', color: '#eee', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.8rem' },
    roomInfo: { display: 'flex', alignItems: 'center', background: '#1e1e1e', padding: '4px 10px', borderRadius: '15px', border: '1px solid #3e3e42' },
    idCode: { fontFamily: 'monospace', color: '#ffd700', marginRight: '8px' },
    status: { display: 'flex', alignItems: 'center', color: '#ccc' },
    langBadge: { background: '#007acc', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', marginRight: '10px', fontWeight: 'bold' },
    
    // STYLE BARU untuk tombol Download & Copy agar seragam
    actionBtn: { 
        background: 'transparent', 
        border: 'none', 
        cursor: 'pointer', 
        color: '#aaa', 
        display: 'flex', 
        padding: '5px',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s'
    }
};

export default EditorPage;