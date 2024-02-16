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

            <div className="article-content">
                <img src={image} alt="movie news" />

                <h1 className="article-content-title">
                    {title}
                </h1>
                
                {content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </>
    );
};

export default ArticlePage;