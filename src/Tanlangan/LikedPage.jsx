import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style/LikedPage.css';

const LikedPage = () => {
  const [liked, setLiked] = useState({});
  const [data, setData] = useState([]); 
useEffect(()=>{
  window.scrollTo(0, 0);
})
  useEffect(() => {
    fetch("http://localhost:5000/anime")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("liked")) || {};
    setLiked(savedLikes);
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

  const likedData = data.filter((anime) => liked[anime.id]);

  return (
    <div className="card_container">
      <h2>Liked Kartalar</h2>
      
      {likedData.length === 0 ? (
        <p className="no-liked">Hali like bosmagansiz ❤️</p>
      ) : (
        <div className="anime-wrapper">
          {likedData.map(anime => (
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
                    <button className={`status ${anime.status}`}>
                      {anime.status === 'premium' ? 'Pulli' : 'Bepul'}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPage;
