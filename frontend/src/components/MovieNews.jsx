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

  const handleArticleClick = (title, content, image) => {
    const urlTitle = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/article/${urlTitle}`, {state: {title: title, content: content, image: image}});
  };

  return (
    <>
      <div className="main-text">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
          alt="Cineberg-Icon"
          onClick={handleIconClick}
        />

        <h1 onClick={handleIconClick}>Cineberg</h1>
        <h3>Latest News</h3>
      </div>

      <div className="news-container">
        {news.map((item, index) => (
          <div key={index} className="news-articles" onClick={() => handleArticleClick(item.title, item.content, item.image)}>
            <img src={item.image} alt={item.title} />
            <div className="text-container">
              <h4>-Movie News-</h4>
              <h1>{item.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieNews;
