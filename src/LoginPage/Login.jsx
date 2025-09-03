import React, { useState, useEffect } from "react";
import './style/Login.css';
import { Link, useNavigate } from "react-router-dom";
import { useSakura } from "../Home/context/context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useSakura(); 
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminUser = {
      email: "admin@gmail.com",
      password: "admin",
      role: "admin"
    };
    const handleSubmit = (e) => {
        e.preventDefault();
      
        const adminUser = {
          email: "admin@gmail.com",
          password: "admin",
          role: "admin"
        };
      
        if (email.trim() === adminUser.email && password === adminUser.password) {
          login(adminUser); 
          navigate("/"); 
          return;
        } 
      
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const storedUser = storedUsers.find(u => u.email === email);
      
      
        if (!storedUser) {
          setError("Ro'yhatdan o'tmagan foydalanuvchi!");
          return;
        }
      
        if (password === storedUser.password) {
          login(storedUser); 
          navigate("/"); 
        } else {
          setError("Email yoki parol noto‘g‘ri!");
        }
      };
      
    if (email.trim() === adminUser.email && password === adminUser.password) {
      login(adminUser); 
      navigate("/"); 
      return;
    } 

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedUser = storedUsers.find(u => u.email === email);

    if (!storedUser) {
      setError("Ro'yhatdan o'tmagan foydalanuvchi!");
      return;
    }

    if (password === storedUser.password) {
      login(storedUser); 
      navigate("/"); 
    } else {
      setError("Email yoki parol noto‘g‘ri!");
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="Login_email">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="Login_input">
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={togglePassword}
            style={{ cursor: "pointer", color: "#ff4d4d" }}
          ></i>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Link to={'/Register'}>Email orqali ro'yhatdan o'tish</Link>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
