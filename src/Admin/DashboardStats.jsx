import React, { useEffect, useState } from "react";
import "./style/dashboardStats.css";
import { useSakura } from "../Home/context/context";

export default function DashboardStats() {
  const { subscriptions } = useSakura();
  const [users, setUsers] = useState([]);
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);

    fetch("http://localhost:5000/anime")
      .then((res) => res.json())
      .then((data) => setAnimes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 🔹 Obunani subscriptions dan olish
  const activeSubs = users.filter(u => {
    const sub = subscriptions[u.email];
    if (!sub) return false;
    const now = new Date();
    return new Date(sub.end) > now;
  }).length;

  const inactiveSubs = users.length - activeSubs;

  const recentAnimes = [...animes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="stats-container">
      <h2 className="stats-title">Statistika Dashboard</h2>
      <div className="stats-cards">
        <div className="card active-users">
          <h3>Faol obunalar</h3>
          <p>{activeSubs}</p>
        </div>
        <div className="card inactive-users">
          <h3>Faolsiz foydalanuvchilar</h3>
          <p>{inactiveSubs}</p>
        </div>
        <div className="card total-users">
          <h3>Jami foydalanuvchilar</h3>
          <p>{users.length}</p>
        </div>
        <div className="card total-animes">
          <h3>Jami animelar</h3>
          <p>{animes.length}</p>
        </div>
      </div>
    </div>
  );
}
