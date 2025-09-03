import React, { useState } from "react";
import "./style/Register.css";
import { Link, useNavigate } from "react-router-dom"; 
import { useSakura } from "../Home/context/context";

export default function Register() {
  const [name, setName] = useState("");        
  const [email, setEmail] = useState("");      
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const { login } = useSakura();
  const navigate = useNavigate(); 

  const togglePassword = () => setShowPassword(!showPassword);
  const togglePassword2 = () => setShowPassword2(!showPassword2);

  const handleRegister = (e) => {
    e.preventDefault();
    setError(""); 

    if (password !== confirmPassword) {
      setError("Parol va tasdiqlash paroli mos emas!");
      return;
    }
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = storedUsers.some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      setError("Bu email allaqachon ro'yxatdan o'tgan!");
      return;
    }
    const newUser = { name, email, password, role: "user" };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    login(newUser);
    navigate("/"); 
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Ro'yxatdan o'tish</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Ismingizni kiriting"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email manzilingiz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parolingiz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={togglePassword}
          ></i>
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Parolni tasdiqlang"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i
            className={`fa-solid ${showPassword2 ? "fa-eye-slash" : "fa-eye"}`}
            onClick={togglePassword2}
          ></i>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="register-text">
          <p>Allaqachon ro'yxatdan o'tdingizmi?</p>
          <Link to="/login">Kirish</Link>
        </div>

        <button type="submit">Ro'yxatdan o'tish</button>
      </form>
    </div>
  );
}
