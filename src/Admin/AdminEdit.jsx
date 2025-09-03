
import React, { useEffect, useState } from "react";
import './style/adminedit.css';

export default function AdminEdit() {
  const [animes, setAnimes] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [removedKeys, setRemovedKeys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [haqida, setHaqida] = useState("Ongoing");
  const [status, setStatus] = useState("free");
  const [imgFile, setImgFile] = useState(null);
  const [videoFiles, setVideoFiles] = useState({});
  const [video, setVideo] = useState({});

  const haqidaOptions = ["Ongoing", "Yakunlangan", "Anime-Filmlar", "Hamma-Animelar", "Carusel"];
  const statusOptions = ["free", "premium"];

  useEffect(() => {
    fetch("http://localhost:5000/anime")
      .then((res) => res.json())
      .then((data) => setAnimes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSelect = (anime) => {
    setSelectedAnime(anime);
    setTitle(anime.title || "");
    setDesc(anime.desc || "");
    setHaqida(anime.haqida || "Ongoing");
    setStatus(anime.status || "free");
    setVideo(anime.video || {});
    setImgFile(null);
    setVideoFiles({});
  };

  const handleImgChange = (e) => {
    if (e.target.files[0]) setImgFile(e.target.files[0]);
  };

  const handleVideoChange = (e, key) => {
    if (e.target.files[0]) {
      setVideoFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const addVideoPart = () => {
    const nextKey = `qism${Object.keys(video).length + 1}`;
    setVideo((prev) => ({ ...prev, [nextKey]: null }));
  };

  const removeVideoPart = (key) => {
    setVideo(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    setVideoFiles(prev => {
      const updatedFiles = { ...prev };
      delete updatedFiles[key];
      return updatedFiles;
    });

    setRemovedKeys(prev => [...prev, key]);
  };

  const handleSave = async () => {
    if (!selectedAnime) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("haqida", haqida);
    formData.append("status", status);
    if (imgFile) formData.append("img", imgFile);

    Object.keys(video).forEach((key) => {
      if (videoFiles[key]) {
        formData.append("videos", videoFiles[key]);
      } else if (video[key]) {
        formData.append("existingVideos", JSON.stringify({ key, filename: video[key] }));
      }
    });

    removedKeys.forEach((key) => formData.append("removedVideos", key));

    try {
      const res = await fetch(`http://localhost:5000/anime/${selectedAnime.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      setSelectedAnime(null);
      setAnimes((prev) => prev.map((a) => (a.id === data.id ? data : a)));
      alert("Anime yangilandi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleDelete = async () => {
    if (!selectedAnime) return;
    if (!window.confirm("Haqiqatan ham ushbu animeni o‘chirmoqchimisiz?")) return;

    try {
      const res = await fetch(`http://localhost:5000/anime/${selectedAnime.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAnimes((prev) => prev.filter((a) => a.id !== selectedAnime.id));
        setSelectedAnime(null);
        alert("Anime o‘chirildi!");
      } else {
        alert("O‘chirishda xatolik!");
      }
    } catch (err) {
      console.error(err);
      alert("Server xatosi!");
    }
  };

  return (
    <div className="admin-edit-container">
      <div className="anime-search">
        <input
          type="text"
          placeholder="Anime qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="anime-list">
        {animes
          .filter(anime => anime.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((anime) => (
            <div
              key={anime.id}
              onClick={() => handleSelect(anime)}
              className={`anime-item ${selectedAnime?.id === anime.id ? "selected" : ""}`}
            >
              {anime.title}
              <span className={`badge ${anime.status}`}>
                {anime.status === "premium" ? "Pulli" : "Bepul"}
              </span>
            </div>
          ))
        }

        <div
          className="anime-item add-new"
          onClick={() => {
            setSelectedAnime({
              id: null,
              title: "",
              desc: "",
              haqida: "Ongoing",
              status: "free",
              video: {}
            });
            setTitle("");
            setDesc("");
            setHaqida("Ongoing");
            setStatus("free");
            setVideo({});
            setImgFile(null);
            setVideoFiles({});
          }}
        >
          <button className="Anime-qoshish"><i className="fa-solid fa-plus"></i> Yangi Anime Qo‘shish</button>
        </div>
      </div>


      {selectedAnime && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedAnime(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-form">

              <div className="admin-form-group">
                <label>Title:</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Description:</label>
                <textarea
                  className="admin-form-textarea"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="admin-flex-row">
                <div className="admin-flex-item">
                  <label>Haqida:</label>
                  <select
                    className="admin-form-select"
                    value={haqida}
                    onChange={(e) => setHaqida(e.target.value)}
                  >
                    {haqidaOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-flex-item">
                  <label>Obuna:</label>
                  <select
                    className="admin-form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statusOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Rasm:</label>
                <input
                  className="admin-form-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImgChange}
                />
                {selectedAnime?.img && (
                  <img
                    className="admin-anime-img-preview"
                    src={`http://localhost:5000${selectedAnime.img}`}
                    alt="anime"
                  />
                )}
              </div>

              <div className="admin-video-column">
                {Object.keys(video).map((key) => (
                  <div key={key} className="admin-video-column">
                    <span className="admin-video-part-name">{key}</span>
                    <input
                      type="file"
                      className="admin-form-file"
                      onChange={(e) => handleVideoChange(e, key)}
                    />
                    <button
                      className="admin-video-remove-btn"
                      onClick={() => removeVideoPart(key)}
                    >
                      O‘chirish
                    </button>
                  </div>
                ))}
                <button
                  className="admin-video-add-btn"
                  onClick={addVideoPart}
                >
                  + Video qo‘shish
                </button>
              </div>

              <div className="admin-modal-actions">
                <button className="admin-save-btn" onClick={handleSave}>Saqlash</button>
                <button className="admin-delete-btn" onClick={handleDelete}>O‘chirish</button>
                <button className="admin-close-btn" onClick={() => setSelectedAnime(null)}>Yopish</button>
              </div>

            </div>
          </div>
        </div>
      )}


    </div>
  );
}
