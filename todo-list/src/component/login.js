import React, { useState } from 'react';
import '../style/loginPage.css';

const Login = ({ onLogin, toggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if(response.ok){
                onLogin(data.token);
            }
            else{
                alert('Invalid username or password');
            }
        } catch(error){
            console.error('Error:', error);
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className='login-form'>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className='login-text'
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='login-text'
                />
                <button type='submit' className='login-button'>Login</button>
            </form>
            {/* link to register page */}
            <p>No account?{' '}<span className='link' onClick={toggle}>Register</span></p>
        </div>
    );
};

export default Login;