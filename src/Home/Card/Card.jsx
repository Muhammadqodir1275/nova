import React, { useState, useEffect } from 'react';
import '../style/Card.css';
import { Link } from 'react-router-dom';

const Card = () => {
  const [liked, setLiked] = useState({});
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("liked")) || {};
    setLiked(savedLikes);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/anime")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  const toggleLike = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(prevLiked => {
      const updated = { ...prevLiked, [id]: !prevLiked[id] };
      localStorage.setItem("liked", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredData = data
    .filter(anime => {
      // Carusel bo'lsa chiqarma
      if (anime.haqida === "Carusel") return false;

      if (filter === "all") return true;
      if (filter === "Ongoing" || filter === "Yakunlangan" || filter === "Anime-Filmlar")
        return anime.haqida === filter;

      return true;
    })
    .slice(0, 12);


  return (
    <div className="card_container">
      <div className="Animelar">
        <div className="anime-cat">
          <Link onClick={() => setFilter("all")}>Hamma Animelar</Link>
          <Link onClick={() => setFilter("Ongoing")}>Ongoing</Link>
          <Link onClick={() => setFilter("Yakunlangan")}>Yakunlangan</Link>
          <Link onClick={() => setFilter("Anime-Filmlar")}>Anime Filmlar</Link>
        </div>
        <Link to={'/Barchsi'} className="all-link">Barchasi {'>'}</Link>
      </div>

      <div className="anime-wrapper">
        {filteredData.map(anime => (
          <Link to={`/Page/${anime.id}`} className="card-link" key={anime.id}>
            <div className="card-body">
              <div
                className={`heart ${liked[anime.id] ? 'liked' : ''}`}
                onClick={(e) => toggleLike(e, anime.id)}
              >
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="card-img-wrapper">
                <img src={`http://localhost:5000${anime.img}`} alt={anime.title} />
                <div className="card-overlay">
                  <h3>{anime.title}</h3>
                  <button
                    className={`status ${anime.status}`}
                    // style={{
                    //   backgroundColor: anime.status === "premium" ? "red" : "green",
                    //   color: "white",
                    //   border: "none",
                    //   padding: "5px 10px",
                    //   borderRadius: "5px",
                    //   cursor: "default"
                    // }}
                  >
                    {anime.status === 'premium' ? 'Pulli' : 'Bepul'}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Card;
