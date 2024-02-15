import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieNews = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/news")
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error("Error scraping news", error));
  }, []);

  const handleIconClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="main-text" onClick={handleIconClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
          alt="Cineberg-Icon"
        />

        <h1>Cineberg</h1>
      </div>

      <div>
        {news.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <h3>{item.content}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieNews;
