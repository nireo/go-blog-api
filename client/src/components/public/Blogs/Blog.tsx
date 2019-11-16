import React from "react";
import { Link } from "react-router-dom";

type Props = {
    description: string;
    id: string;
    title: string;
    likes: number;
};

const Blog: React.FC<Props> = ({ description, id, title, likes }) => {
    return (
        <div>
            <Link to={`/blog/${id}`}>
                <h3>{title}</h3>
            </Link>
            <p>{description}</p>
            <p>likes</p>
        </div>
    );
};

export default Blog;
