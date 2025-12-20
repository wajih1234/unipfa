import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 
import { Link } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const handleLogin = async(event) => {
    event.preventDefault();

    if (!email || !password) return;

    try {
      const response = await fetch('http://localhost:5200/logic/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role } = data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        if (role === 'teacher') {
          navigate('/teach');
        } else if (role === 'student') {
          navigate('/Home');
         
        } else {
          setErrorMsg('Unknown role');
        }
      } else {
        setErrorMsg(data.msg || 'Login failed');
        alert('the password or the email is incorrect');
      }
    } catch (error) {
      console.error('Login error:', errorMsg);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className="login-page">
        <div className='container0'>
          <form >
        <div className='input-container'>
         <input
          placeholder='email'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
    
        </div>
        <div className='input-container mt-20'>
          <input
         placeholder='password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
    
        </div>
        
        <div className='forget'>
        <section>
                  <input type="checkbox" id="check" />
                  <label htmlFor="check">Remember me</label>
        </section>
        <section>
        <button type="button" >
               <Link to="/sign"  className='no'>Sign Up</Link> 
     </button>
    </section>

        </div>

        <button  className='sub' onClick={handleLogin} type='submit' >
          Login
        </button>
      </form>
    </div>
    </div>
      
  )
}

export default Login