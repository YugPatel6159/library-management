import logo from './logo.svg';
import './App.css';
import LoginPage from './components/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './components/RegisterPage';
import PasswordResetPage from './components/PasswordResetPage';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotpassword" element={<PasswordResetPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 
