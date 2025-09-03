import React, { useState, useEffect } from "react";
import "./style/Carusel.css";
import { Link } from "react-router-dom";

export default function Carusel() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/anime")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  const images = data.filter((item) => item.haqida === "Carusel");

  const showSlide = (n) => {
    let newIndex = n;
    if (n < 0) newIndex = images.length - 1;
    if (n >= images.length) newIndex = 0;
    setIndex(newIndex);
  };

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="carousel-container">
      <div
        className="carousel-slide"
        style={{ transform: `translateX(${-index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div className="slide" key={i}>
            <img src={`http://localhost:5000${img.img}`} alt={img.title} />
            <div className="yozuvlar">
              <Link to={`/Page/${img.id}`} className="title">{img.title}</Link>
              <h4 className="desc">{img.desc}</h4>
              <Link to={`/Page/${img.id}`} className="korish-btn">
                Ko‘rish
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className="prev" onClick={() => showSlide(index - 1)}>
        &#10094;
      </button>
      <button className="next" onClick={() => showSlide(index + 1)}>
        &#10095;
      </button>

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => showSlide(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
