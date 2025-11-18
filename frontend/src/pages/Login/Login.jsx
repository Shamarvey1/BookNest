import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <form>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter your username" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
