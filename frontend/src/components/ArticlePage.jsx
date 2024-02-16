import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ArticlePage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { content } = location.state;

    const handleBackClick = () => {
        navigate("/news");
    };

    return (
        <div>
            <div className="back-button" onClick={handleBackClick}>
                <span className="back-arrow">&lt;</span>
            </div>
           <p>{content}</p>
        </div>
    );
};

export default ArticlePage;