import React, { useState } from 'react';

const Register = ({ onRegister, toggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        // check if password match
        if(password !== confirmPassword){
            alert('Password does not match');
            return;
        }

        // send request to server
        try{
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if(response.ok){
                onRegister();
                alert('Registration successful');
            }
            else{
                alert('Registration failed: ' + data.message);
            }
        } catch(error){
            console.error('Error:', error);
        }
    }

return(
    <div>
        <h2>Register</h2>
        <form onSubmit = {handleRegister}>
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <button type='submit'>Register</button>
        </form>
        {/* link to login page */}
        <p>Already have an account?{' '}<span className='link' onClick={toggle}>Login</span></p>
    </div>
);
};

export default Register;