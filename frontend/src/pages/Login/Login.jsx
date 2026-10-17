import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiZap } from "react-icons/fi";
import { loginAPI } from "../../services/authService";
import openBook from "../../assets/icons/open-book.png";
import "./Login.css";

const ADMIN_EMAIL = "ajitlookforbest@gmail.com";
const ADMIN_PASSWORD = "123456";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/main", { replace: true });
		}
	}, [navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await loginAPI({ email, password });
			localStorage.setItem("token", res.token);
			window.dispatchEvent(new CustomEvent("tokenChanged", { detail: { token: res.token } }));
			navigate("/main");
		} catch (error) {
			alert(error.message);
			setLoading(false);
		}
	};

	const handleAdminLogin = async () => {
		setEmail(ADMIN_EMAIL);
		setPassword(ADMIN_PASSWORD);
		setLoading(true);
		try {
			const res = await loginAPI({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
			localStorage.setItem("token", res.token);
			window.dispatchEvent(new CustomEvent("tokenChanged", { detail: { token: res.token } }));
			navigate("/main");
		} catch (error) {
			alert(error.message);
			setLoading(false);
		}
	};

	const fillAdminCredentials = () => {
		setEmail(ADMIN_EMAIL);
		setPassword(ADMIN_PASSWORD);
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
					<p className="form-subtitle">Log in to continue reading</p>

					{/* Admin Quick Login Box */}
					<div className="admin-access-card">
						<div className="admin-access-header">
							<span className="admin-badge">
								<FiShield className="admin-badge-icon" /> Admin / Demo Account
							</span>
							<button
								type="button"
								className="btn-admin-fill"
								onClick={fillAdminCredentials}
								title="Fill fields with admin credentials"
							>
								Auto Fill
							</button>
						</div>
						<div className="admin-credentials">
							<div><span>Email:</span> <code>{ADMIN_EMAIL}</code></div>
							<div><span>Password:</span> <code>{ADMIN_PASSWORD}</code></div>
						</div>
						<button
							type="button"
							className="btn-admin-login"
							onClick={handleAdminLogin}
							disabled={loading}
							aria-busy={loading}
						>
							<FiZap /> 1-Click Admin Login
						</button>
					</div>

					<div className="divider-or">
						<span>OR SIGN IN MANUALLY</span>
					</div>

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

						<button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
							{loading ? "Logging in..." : "Log In"}
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
