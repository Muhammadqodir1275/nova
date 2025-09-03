import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./style/Page.css";
import { useSakura } from "../Home/context/context";

const CardPage = () => {
  const { id } = useParams();
  const { user, admin, subscriptions } = useSakura();
  const [anime, setAnime] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch("http://localhost:5000/anime")
      .then((res) => res.json())
      .then((json) => {
        const found = json.find((a) => a.id === parseInt(id));
        if (found) {
          setAnime(found);
          const firstVideoKey = Object.keys(found.video)[0];
          setSelectedVideo(firstVideoKey || "");
        }
      })
      .catch(console.error);

    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`) || "[]");
    if (savedComments) setComments(savedComments);
  }, [id]);

  const userSub = user?.email ? subscriptions[user.email] : null;
  const isSubscribed = userSub && new Date(userSub.end) > new Date();
  const isAdmin = admin?.role === "admin";
  const canWatch = anime?.status === "free" || isAdmin || isSubscribed;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user && !admin) {
      alert("Hali ro‘yxatdan o‘tmagansiz! Kommentariya qo‘shish uchun login qiling.");
      return;
    }
    if (!newComment.trim()) return;

    const commentObj = {
      user: admin ? `${admin.name} (Admin)` : user.name,
      text: newComment,
      date: new Date().toLocaleString(),
    };

    const updatedComments = [...comments, commentObj];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const handleDownload = async () => {
    if (!anime || !selectedVideo || !anime.video[selectedVideo]) return;

    let path = anime.video[selectedVideo];
    if (!path.startsWith("/")) path = `/uploads/${path}`;
    const videoUrl = `http://localhost:5000${path}`;

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Video topilmadi!");

      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${anime.title}_${selectedVideo}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Video yuklab olinmadi!");
    }
  };



  return (
    <div className="cardpage-container">
      <Link to="/">⬅ Orqaga</Link>

      <h1>{anime?.title || "Anime topilmadi"}</h1>
      <p>{anime?.desc || "Anime qo‘yilmagan"}</p>
      <p>Kategoriya: {anime?.haqida || "-"}</p>

      <div className="video-box">
        {!anime && <div className="video-alert">Anime qo‘yilmagan</div>}

        {!user && !admin && (
          <div className="video-alert">
            <p>Hali ro‘yxatdan o‘tmagansiz!</p>
          </div>
        )}

        {anime && anime.status === "premium" && (user || admin) && !isSubscribed && !isAdmin && (
          <div className="video-alert">
            <p>Pulli video. Iltimos obuna bo‘ling!</p>
          </div>
        )}

        {anime && (user || admin) && (!anime.video || Object.keys(anime.video).length === 0 || !selectedVideo || !anime.video[selectedVideo]) && (
          <div className="video-alert">
            <p>Video mavjud emas</p>
          </div>
        )}

        {anime && (user || admin) && anime.video && selectedVideo && anime.video[selectedVideo] && canWatch && (
          <div className="video-player">
            <video
              key={anime.video[selectedVideo]}
              src={`http://localhost:5000${anime.video[selectedVideo]}`}
              controls
              autoPlay
              width="800"
              height="450"
              poster="/fallback.jpg"
            >
              Sizning brauzeringiz video tagini qo‘llab-quvvatlamaydi.
            </video>

            <div className="video-buttons">
              {Object.keys(anime.video).map((key) => (
                <button
                  key={key}
                  className={selectedVideo === key ? "active" : ""}
                  onClick={() => setSelectedVideo(key)}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>

            <button className="load-video" onClick={handleDownload}>
              <i className="fa-solid fa-download"></i> Yuklash
            </button>
          </div>
        )}
      </div>



      <div className="comments-section">
        <h4>Kommentariyalar</h4>
        <ul>
          {comments.length === 0 && <li>Hali kommentariya yo‘q.</li>}
          {comments.map((c, i) => (
            <li key={i}>
              {c.user ? `${c.user}: ` : ""}
              {c.date}: {c.text}
            </li>
          ))}
        </ul>

        {(user || admin) && (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Kommentariya yozing..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Qo'shish</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CardPage;
