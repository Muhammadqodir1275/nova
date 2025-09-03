import React, { useEffect, useState } from "react";
import "./style/obuna.css";
import { useSakura } from "../Home/context/context";
import { Link } from "react-router-dom";

export default function Obuna({ onSubscribe }) {
  const { user, logout, login, subscriptions, subscribeUser } = useSakura();

  const handleSubscribeClick = () => {
    const plan = PLANS.find((p) => p.id === selected);
    if (!plan || !user?.email) return;

    subscribeUser(user.email, plan);
    setSubscribedPlan(plan);
  };


  const [modalOpen, setModalOpen] = useState(false);
  // const [newName, setNewName] = useState(user?.name || "");
  const [selected, setSelected] = useState(null);
  const [subscribedPlan, setSubscribedPlan] = useState(null);
  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const [PLANS, setPLANS] = useState([
    { id: "m1", label: "1 Oy", name: "Basic", price: 15000, periodText: "/oy" },
    { id: "m3", label: "3 Oy", name: "Standard", price: 39000, periodText: "/3 oy" },
    { id: "m6", label: "6 Oy", name: "Premium", price: 66000, periodText: "/6 oy" },
    { id: "y1", label: "1 Yil", name: "Annual", price: 110000, periodText: "/yil" },
  ]);
  useEffect(() => {
    if (user?.email && subscriptions[user.email]) {
      const plan = PLANS.find((p) => p.id === subscriptions[user.email].planId);
      setSubscribedPlan(plan);
    }
  }, [user, subscriptions]);


  const handleSaveName = () => {
    if (!newName.trim()) return;
    const updatedUser = { ...user, name: newName };
    login(updatedUser);
    setModalOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result };
      login(updatedUser);
    };
    reader.readAsDataURL(file);
  };
  return (
    <section className="plans">
      <div className="user-card">
        <div className="user-left">
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="User avatar" />
            ) : (
              <div className="default-avatar">
                <i className="fa-solid fa-circle-user"></i>
              </div>
            )}

            <label className="upload-btn">
              <i className="fa-solid fa-camera"></i>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>

          <div className="user-info">
            <div className="obuna-user-name">
              <p>{user?.name || "Mehmon"}</p>
              <i className="fa-solid fa-user-pen" onClick={() => setModalOpen(true)}></i>
            </div>
            <div className="user-email">{user?.email || "Mehmon"}</div>
          </div>
        </div>

        <div className="user-right">
          <button className="logout-btn" onClick={logout}>Chiqish</button>
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ma’lumotlarni o‘zgartirish</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Yangi ism..."
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Yangi email..."
            />
            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={() => {
                  if (!newName.trim() || !newEmail.trim()) return;
                  const updatedUser = { ...user, name: newName, email: newEmail };
                  login(updatedUser);
                  setModalOpen(false);
                }}
              >
                Saqlash
              </button>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="plans-title">Obuna rejalarimiz</h2>
      <div className="plans-grid">
        {PLANS.map((plan) => {
          const isSubscribed = subscribedPlan?.id === plan.id; // faqat shu user uchun
          return (
            <article
              key={plan.id}
              className={`plan-card ${selected === plan.id ? "active" : ""} ${isSubscribed ? "subscribed" : ""}`}
              onClick={() => setSelected(plan.id)}
            >
              <div className="obuna-text">
                <h3>{plan.label}</h3>
                <p className="price">{plan.price.toLocaleString()} so‘m</p>
              </div>

              {isSubscribed ? (
                <div className="cta">✅ Obuna bo‘lgansiz</div>
              ) : (
                <Link
                  to={`/payment/${plan.id}`}
                  className="cta"
                  onClick={handleSubscribeClick}
                >
                  Obuna bo‘lish
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
