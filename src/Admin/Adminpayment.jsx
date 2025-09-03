import React, { useState, useEffect } from "react";
import { useSakura } from "../Home/context/context";
import "./style/adminpayment.css";

export default function Adminpayment() {
  const { payments, setPayments, admin, setAdmin } = useSakura();

  const PLANS = [
    { id: "m1", label: "1 Oy", price: 15000 },
    { id: "m3", label: "3 Oy", price: 39000 },
    { id: "m6", label: "6 Oy", price: 66000 },
    { id: "y1", label: "1 Yil", price: 110000 },
  ];

  const [planEdits, setPlanEdits] = useState(() => PLANS.map(p => ({ ...p })));
  const [adminEmail, setAdminEmail] = useState(admin?.email || "");
  const [adminPassword, setAdminPassword] = useState(admin?.password || "");
  const [showPassword, setShowPassword] = useState(false);

  // Agar mavjud payments obyektlarida id bo'lmasa, ularni normalizatsiya qilish
  useEffect(() => {
    if (!payments || payments.length === 0) return;
    const needIds = payments.some(p => !p.id);
    if (!needIds) return;

    const normalized = payments.map((p, i) => ({
      ...p,
      id: p.id ?? `pay_${Date.now()}_${i}`
    }));

    setPayments(normalized);
    localStorage.setItem("payments", JSON.stringify(normalized));
  }, [payments, setPayments]);

  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) setPlanEdits(JSON.parse(savedPlans));

    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      const parsed = JSON.parse(savedAdmin);
      setAdminEmail(parsed.email);
      setAdminPassword(parsed.password);
    }
  }, []);

  const handlePlanChange = (id, field, value) => {
    setPlanEdits(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, [field]: field === "price" ? Number(value) : value } : plan
      )
    );
  };

  const savePlanChanges = () => {
    localStorage.setItem("plans", JSON.stringify(planEdits));
    alert("Obuna rejalar o‘zgartirildi ✅");
  };

  const saveAdminChanges = () => {
    const updatedAdmin = { ...admin, email: adminEmail, password: adminPassword };
    setAdmin(updatedAdmin);
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    alert("Admin email va parol o‘zgartirildi ✅");
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  // handleDelete: endi ID orqali o'chiradi (index ishlatmaymiz)
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Ushbu to‘lovni o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    const updated = payments.filter(p => p.id !== id);
    setPayments(updated);
    localStorage.setItem("payments", JSON.stringify(updated));
  };

  return (
    <div className="admin-payment-container">
      <div className="admin-payment">
        <h2>💳 Admin Panel - To‘lovlar</h2>

        {(!payments || payments.length === 0) ? (
          <p className="no-payments">Hozircha hech qanday to‘lov kelmagan 😔</p>
        ) : (
          <ul className="payments-list">
            {payments.map((p) => (
              <li key={p.id} className="payment-item">
                {p.image && (
                  <div className="payment-image">
                    <img src={p.image} alt={`Chek-${p.id}`} />
                  </div>
                )}
                <p><strong>Foydalanuvchi ismi:</strong> {p.name}</p>
                <p><strong>Email:</strong> {p.email}</p>
                <p><strong>Obuna rejasi:</strong> {p.plan}</p>
                {p.price && <p><strong>Summa:</strong> {p.price.toLocaleString()} so‘m</p>}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  <i className="fa-solid fa-trash"></i> O‘chirish
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="obunani-ozgartirish">
        <h2>🛠 Obuna Rejalarni Tahrirlash</h2>
        <div className="plans-edit-grid">
          {planEdits.map((plan) => (
            <div key={plan.id} className="plan-edit-card">
              <h3>{plan.label}</h3>
              <label>
                Narx (so‘m):
                <input
                  type="text"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(plan.id, "price", e.target.value)}
                />
              </label>
              <label>
                Muddat:
                <select
                  value={plan.label}
                  onChange={(e) => handlePlanChange(plan.id, "label", e.target.value)}
                >
                  <option value="1 Oy">1 Oy</option>
                  <option value="3 Oy">3 Oy</option>
                  <option value="6 Oy">6 Oy</option>
                  <option value="1 Yil">1 Yil</option>
                </select>
              </label>
            </div>
          ))}
        </div>
        <button className="save-btn" onClick={savePlanChanges}>💾 Saqlash</button>
      </div>

      <div className="admin-edit">
        <h2>🔑 Admin Email va Parolni O‘zgartirish</h2>
        <label>
          Email:
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </label>
        <label>
          Parol:
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePassword}
            ></i>
          </div>
        </label>
        <button className="admin-save-btn" onClick={saveAdminChanges}>💾 Saqlash</button>
      </div>
    </div>
  );
}
