import './App.css';
import MoneyManager from './components/MoneyManager.jsx'
import Admin from './components/Admin.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage.jsx'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/app" element={<MoneyManager />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}