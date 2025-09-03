import React, { useState, useEffect } from "react";
import "./style/hourglass.css";

export default function Hourglass({ size = 60 }) {
  const [rotated, setRotated] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    // Soatning bir animatsiya tsikli (qum tushishi)
    const timer = setTimeout(() => {
      setRotated(prev => !prev); // 180° aylantirish
    }, 3000); // 3s → qum pastga tushadi
    return () => clearTimeout(timer);
  }, [rotated, animating]);

  return (
    <div
      className={`hg-container ${rotated ? "rotated" : ""}`}
      style={{ width: size, height: size * 1.6 }}
    >
      <div className="hg-frame" />
      <div className="hg-sand hg-sand-top" />
      <div className="hg-sand hg-sand-bottom" />
      <div className="hg-stream" />
    </div>
  );
}
