import { useState, useEffect } from "react";

const MovieNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/news")
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error("Error scraping news", error));
  }, []);

  return (
    <div>
      {news.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <h3>{item.content}</h3>
        </div>
      ))}
    </div>
  );
};

export default MovieNews;
