import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { loginAPI } from "../../services/authService";
import openBook from "../../assets/icons/open-book.png";
import "./Login.css";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/main", { replace: true });
		}
	}, [navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await loginAPI({ email, password });
			localStorage.setItem("token", res.token);
			window.dispatchEvent(new CustomEvent("tokenChanged", { detail: { token: res.token } }));
			navigate("/main");
		} catch (error) {
			alert(error.message);
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
					<h2>Welcome Back</h2>
					<p>Log in to continue reading</p>

					<form onSubmit={handleLogin}>
						<div className="input-group">
							<label>Email</label>
							<div className="input-wrapper">
								<span className="input-icon">
									<FiMail />
								</span>
								<input
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className="input-group">
							<label>Password</label>
							<div className="input-wrapper">
								<span className="input-icon">
									<FiLock />
								</span>
								<input
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</div>

						<button type="submit" className="btn-primary">
							Log In
						</button>
						<p className="switch-text">
							Don&apos;t have an account?
							<span onClick={() => navigate("/signup")}> Sign Up</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
