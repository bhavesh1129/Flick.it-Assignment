import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComingSoon, HomePage, Login, Register } from "./components"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<ComingSoon />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
        <Route path="/contact" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
