import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Sign from './pages/Sign';
import Login from './pages/Login';
import Teach from './pages/Teach';
import Addproject from './pages/Addproject';
import VerifyOTP from './pages/VerifyOTP'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/home" element={<Home />} />
        <Route path='/teach' element={<Teach />} />
        <Route path='/addproject' element={<Addproject />} />
        <Route path='/verify-otp' element={<VerifyOTP />} /> 
      </Routes>
    </Router>
  )
}

export default App;