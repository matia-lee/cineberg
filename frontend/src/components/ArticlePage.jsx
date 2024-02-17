import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ArticlePage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { title, content, image } = location.state;

    const handleBackClick = () => {
        setTimeout(() => {
            navigate("/news");
        }, 125)
    };

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

            <div className="article-paragraph">
                {content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </>
    );
};

export default ArticlePage;