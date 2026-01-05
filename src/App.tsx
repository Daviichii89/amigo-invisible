import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { I18nProvider } from './contexts/I18nContext'
import { LoginPage } from './components/LoginPage'
import { HomePage } from './components/HomePage'
import { CreateGroupPage } from './components/CreateGroupPage'
import { JoinGroupPage } from './components/JoinGroupPage'
import { GroupViewPage } from './components/GroupViewPage'

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <I18nProvider>
        <LoginPage />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-group" element={<CreateGroupPage userId={user.uid} />} />
          <Route path="/join-group" element={
          <JoinGroupPage
            userId={user.uid}
            userName={user.displayName || 'Usuario'}
            userEmail={user.email || ''}
          />
        } />
        <Route path="/group/:groupId" element={<GroupViewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </I18nProvider>
  );
}

export default App
