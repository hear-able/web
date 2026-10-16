import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './lib/auth'
import Landing from './pages/Landing'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import VolunteerLayout from './pages/volunteer/Layout'
import Dashboard from './pages/volunteer/Dashboard'
import CreateListening from './pages/volunteer/CreateListening'
import CreateSpeaking from './pages/volunteer/CreateSpeaking'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/relawan/masuk" element={<LoginPage />} />
          <Route path="/relawan/daftar" element={<RegisterPage />} />
          <Route path="/relawan" element={<VolunteerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="mendengar/baru" element={<CreateListening />} />
            <Route path="berbicara/baru" element={<CreateSpeaking />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
