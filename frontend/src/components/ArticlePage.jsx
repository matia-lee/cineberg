import { useLocation } from "react-router-dom";

const ArticlePage = () => {

    const location = useLocation();
    const { content } = location.state;

    return (
        <div>
           <p>{content}</p>
        </div>
    );
};

export default ArticlePage;