import React, { createContext, useContext, useState } from "react";

const SakuraContext = createContext();

export const SakuraProvider = ({ children }) => {
  const [payments, setPayments] = useState(() => {
    return JSON.parse(localStorage.getItem("payments")) || [];
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [showSakura, setShowSakura] = useState(false);

  // 🔹 subscriptionlarni saqlash (user bo‘yicha)
  const [subscriptions, setSubscriptions] = useState(() => {
    return JSON.parse(localStorage.getItem("subscriptions")) || {};
  });

  // login
  const login = (userData) => {
    if (userData.role === "admin") {
      setAdmin(userData);
      localStorage.setItem("admin", JSON.stringify(userData));
    } else {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // logout
  const logout = (role) => {
    if (role === "admin") {
      setAdmin(null);
      localStorage.removeItem("admin");
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // payment qo‘shish
  const addPayment = (paymentData) => {
    setPayments((prev) => {
      const updated = [...prev, paymentData];
      localStorage.setItem("payments", JSON.stringify(updated));
      return updated;
    });
  };

  // payment narxini yangilash
  const updatePaymentPrice = (index, newPrice) => {
    const updated = [...payments];
    updated[index].price = newPrice;
    setPayments(updated);
    localStorage.setItem("payments", JSON.stringify(updated));
  };

  // 🔹 obuna qo‘shish
  const subscribeUser = (email, plan) => {
    const now = new Date();
    let expiry = new Date();

    if (plan.id === "m1") expiry.setMonth(now.getMonth() + 1);
    if (plan.id === "m3") expiry.setMonth(now.getMonth() + 3);
    if (plan.id === "m6") expiry.setMonth(now.getMonth() + 6);
    if (plan.id === "y1") expiry.setFullYear(now.getFullYear() + 1);

    const newSubscriptions = {
      ...subscriptions,
      [email]: {
        planId: plan.id,
        start: now.toISOString(),
        end: expiry.toISOString(),
      },
    };

    setSubscriptions(newSubscriptions);
    localStorage.setItem("subscriptions", JSON.stringify(newSubscriptions));
  };

  // 🔹 obunani olib tashlash
  const unsubscribeUser = (email) => {
    const newSubscriptions = { ...subscriptions };
    delete newSubscriptions[email];
    setSubscriptions(newSubscriptions);
    localStorage.setItem("subscriptions", JSON.stringify(newSubscriptions));
  };

  const toggleSakura = () => setShowSakura(prev => !prev);

  return (
    <SakuraContext.Provider
      value={{
        showSakura,
        toggleSakura,
        login,
        logout,
        user,
        setUser,
        admin,
        addPayment,
        payments,
        updatePaymentPrice,
        setPayments,
        subscriptions,
        subscribeUser,
        unsubscribeUser,
      }}
    >
      {children}
    </SakuraContext.Provider>
  );
};

export const useSakura = () => useContext(SakuraContext);
