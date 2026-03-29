import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; // 👈 add this
import '../styles/sign.css';

const Sign = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [domain, setDomain] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate(); // 👈 add this

  const handleSign = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !role) return;
    if (role === "teacher" && !domain) {
      setErrorMsg("Domain is required for teacher");
      return;
    }

    const bodyData = {
      name,
      email,
      password,
      role,
      ...(role === "teacher" && { domain })
    };

    try {
      const response = await fetch('http://localhost:5200/logic/auth/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (response.ok) {
      
        navigate('/verify-otp', { state: { email } });
      } else {
        setErrorMsg(data.msg || 'Registration failed');
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <div className='si'>
      <form>
        <input type='text' placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Select role --</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {role === 'teacher' && (
          <input type='text' placeholder='domain' value={domain} onChange={(e) => setDomain(e.target.value)} />
        )}
        <button type='submit' onClick={handleSign}>Sign in</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}

export default Sign