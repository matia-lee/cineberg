import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ArticlePage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { title, content, image, author, date } = location.state;

    const handleBackClick = () => {
        setTimeout(() => {
            navigate("/news");
        }, 125)
    };

    useEffect (() => {
        window.scrollTo(0,0);
    }, []);

    return (
        <>
            <div className="back-button" onClick={handleBackClick}>
                <span className="back-arrow">&lt;</span>
            </div>

            <div className="title-container">
                <div className="article-title">
                    <p>Cineberg News</p>
                    <h1>{title}</h1>
                </div>

                <div className="title-picture">
                    <img src={image} alt="movie news" />
                </div>
            </div>

            <div className="date">
                <h3>
                    <span className="label">Written by:</span> 
                    <span className="details">{author}</span>
                    <span className="dividor">|</span>
                    <span className="label"> Published on:</span>
                    <span className="details">{date}</span>
                </h3>
            </div>       

            <div className="article-paragraph">
                {content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </>
    );
};

export default ArticlePage;