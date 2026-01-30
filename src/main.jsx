import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Pastikan file ini ada (bisa kosongkan isinya dulu)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> // Matikan StrictMode saat development socket agar tidak connect 2x
    <App />
  // </React.StrictMode>,
)