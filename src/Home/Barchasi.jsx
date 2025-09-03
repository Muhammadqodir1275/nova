import React, { useEffect, useState } from 'react';
import Navbar from './navbar/navbar';
import Footer from './Footer/footer';
import { Link } from 'react-router-dom';

const Barchasi = () => {
  const [data, setData] = useState([]); 
  const [liked, setLiked] = useState({}); 

  useEffect(() => {
    fetch("http://localhost:5000/anime") 
      .then(res => res.json())
      .then(json => {
        setData(json);
        const savedLikes = JSON.parse(localStorage.getItem("liked")) || {};
        setLiked(savedLikes);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("liked", JSON.stringify(liked));
  }, [liked]);

  const toggleLike = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Navbar />
      <div className="card_container">
        <div className="anime-wrapper">
          {data.map(anime => (
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
      <Footer />
    </>
  );
};

export default Barchasi;
