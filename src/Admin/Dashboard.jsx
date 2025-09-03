import React, { useEffect, useState } from "react";
import "./style/dashboard.css";
import { useSakura } from "../Home/context/context";

export default function Dashboard() {
  const { subscriptions, unsubscribeUser, subscribeUser } = useSakura();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Foydalanuvchilar ro‘yxati</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Ism</th>
            <th>Email</th>
            <th>Obuna</th>
            <th>Amal</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="no-users">
                Foydalanuvchi topilmadi
              </td>
            </tr>
          )}
          {users.map((u, index) => {
            const sub = subscriptions[u.email];
            const now = new Date();
            const isActive = sub && new Date(sub.end) > now;

            return (
              <tr key={index} className={isActive ? "active-user" : ""}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className={isActive ? "active-sub" : "inactive-sub"}>
                  {isActive
                    ? `Faol (${new Date(sub.end).toLocaleDateString()})`
                    : "Yo‘q"}
                </td>
                <td>
                  <button
                    className="subscribe-btn one-month"
                    onClick={() =>
                      subscribeUser(u.email, { id: "m1" })
                    }
                  >
                    1 Oy
                  </button>
                  <button
                    className="subscribe-btn three-month"
                    onClick={() =>
                      subscribeUser(u.email, { id: "m3" })
                    }
                  >
                    3 Oy
                  </button>
                  <button
                    className="subscribe-btn six-month"
                    onClick={() =>
                      subscribeUser(u.email, { id: "m6" })
                    }
                  >
                    6 Oy
                  </button>
                  <button
                    className="subscribe-btn one-year"
                    onClick={() =>
                      subscribeUser(u.email, { id: "y1" })
                    }
                  >
                    1 Yil
                  </button>
                  <button
                    className="unsubscribe-btn"
                    onClick={() => unsubscribeUser(u.email)}
                  >
                    Faolsizlantirish
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
