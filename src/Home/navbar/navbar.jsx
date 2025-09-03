import React, { useState, useEffect } from "react";
import "../style/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSakura } from "../context/context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [useropen, setUserOpen] = useState(false);
  const { toggleSakura, user, admin, logout } = useSakura();
  const navigate = useNavigate();
  const currentUser = user || admin;

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/anime")
      .then((res) => res.json())
      .then((json) => setAnimeData(json))
      .catch((err) => console.error(err));
  }, []);

  // scroll block hamburger ochilganda
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setResults([]);
    } else {
      const filtered = animeData.filter((anime) =>
        anime.title.toLowerCase().includes(value.toLowerCase())
      );
      const uniqueFiltered = Array.from(new Set(filtered.map((a) => a.title))).map(
        (title) => filtered.find((a) => a.title === title)
      );
      setResults(uniqueFiltered.slice(0, 5));
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to={"/"} className="logo">
          NoVa Fandub
        </Link>

        <div className="input">
          <input
            type="text"
            placeholder="Anime Izlash..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fa-solid fa-search"></i>

          {results.length > 0 && (
            <div className="search-results">
              {results.map((anime) => (
                <Link
                  to={`/Page/${anime.id}`}
                  key={anime.id}
                  className="search-item"
                  onClick={() => {
                    setSearchTerm("");
                    setResults([]);
                  }}
                >
                  <img
                    src={`http://localhost:5000${anime.img}`}
                    alt={anime.title}
                  />
                  <span>{anime.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          className={open ? "hamburger active" : "hamburger"}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className="nav-links desktop-menu">
        <li>
          {currentUser ? (
            <div className="user-info">
              <span className="user-name" onClick={() => setUserOpen(!useropen)}>
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="user-avatar"
                  />
                ) : (
                  <i className="fa-solid fa-circle-user"></i>
                )}
                {currentUser.role === "admin" ? "Admin" : currentUser.name}
              </span>

              {useropen && (
                <div className="user-dropdown">
                  {currentUser.role === "admin" && (
                    <Link to="/admin" className="admin-btn">
                      Admin
                    </Link>
                  )}
                  {currentUser.role !== "admin" && (
                    <Link to="/obuna" className="subscribe-btn">
                      Obuna
                    </Link>
                  )}
                  <button
                    className="logout-btn"
                    onClick={() => {
                      logout(currentUser.role);
                      navigate("/");
                    }}
                  >
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={"/login"} className="login-link">
              <i className="fa-solid fa-circle-user"></i> Kirish
            </Link>
          )}
        </li>

        <li>
          <Link to={"/tanlangan"} className="login-link">
            Tanlanganlar
          </Link>
        </li>

        <li className="sakura-btn" onClick={toggleSakura}>
          <a href="#">🌸</a>
        </li>
      </ul>

      <ul className={`nav-links mobile-menu ${open ? "open" : ""}`}>
        {currentUser ? (
          <li className="user-item">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-avatar"
              />
            ) : (
              <div className="user_admin-sakura">
                <div className="userflex">
                  <i className="fa-solid fa-circle-user"></i>
                  <span className="user-name">
                    {currentUser.role === "admin" ? "Admin" : currentUser.name}
                  </span>
                </div>
                <span className="sakura-btn" onClick={toggleSakura}>
                  <a href="#">🌸</a>
                </span>
              </div>
            )}

            <div className="user-menu">
              <Link to={"/tanlangan"} className="menu-link">
                Tanlanganlar
              </Link>
              {currentUser.role === "admin" && (
                <Link to="/admin" className="menu-link">
                  Admin
                </Link>
              )}
              {currentUser.role !== "admin" && (
                <Link to="/obuna" className="menu-link">
                  Obuna
                </Link>
              )}
              <button
                className="menu-link logout-btn"
                onClick={() => {
                  logout(currentUser.role);
                  navigate("/");
                }}
              >
                Chiqish
              </button>
            </div>
          </li>
        ) : (
          <li>
            <Link to={"/login"} className="login-link">
              <i className="fa-solid fa-circle-user"></i> Kirish
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
