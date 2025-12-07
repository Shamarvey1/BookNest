import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";   
import "./Landing.css";
import { signupAPI, loginAPI } from "../../services/authService";
import openBook from "../../assets/icons/open-book.png";

const Landing = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token){
      navigate("/main");
    }
    else{
      navigate("/")
    }
  }, []);


  const [isLogin, setIsLogin] = useState(mode !== "signup");


  const [name, setName] = useState("");     
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLogin(false);
    }
    else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleSwitch = () => {
    if (isLogin) {
      navigate("/signup");
    }
    else{ 
      navigate("/");
    }
  };

  return (
    <div className="landing-container">


      <div className="landing-left">
        <div className="brand-box">
          <div className="logo">
            <img src={openBook} alt="BookNest Logo" />

          </div>
          <h1>Welcome to BookNest</h1>
          <p>Your personal library to discover, read, and track your favorite books</p>
        </div>
      </div>


      <div className="landing-right">
        <div className="form-card">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Log in to continue reading" : "Sign up to get started"}</p>


          <form onSubmit={async (e) => {e.preventDefault();
              try {
                if (isLogin) {
                  const res = await loginAPI({ email, password });
                  localStorage.setItem("token", res.token);
                  navigate("/main");
                } 
                else {
                  await signupAPI({ name, email, password });
                  navigate("/");
                }
              } 
              catch (error) {
                alert(error.message);
              }
            }} >

            {!isLogin && (
              <div className="input-group">
                <label>Name</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FiUser /></span>
                  <input type="text" placeholder="Enter your name" value={name}  onChange={(e) => 
                  setName(e.target.value)}/>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <span className="input-icon"><FiMail /></span>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => 
                setEmail(e.target.value)}/>
              </div>
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><FiLock /></span>
                <input type="password" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              </div>
            </div>
            {isLogin && (
              <div className="forgot">
                <a href="#">Forgot password?</a>
              </div>
            )}
            <button type="submit" className="btn-primary">{isLogin ? "Log In" : "Sign Up"}</button>
            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span onClick={handleSwitch}>
                {isLogin ? " Sign Up" : " Log In"}
              </span>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Landing;
