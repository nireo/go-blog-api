import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { getPostById } from "../../../store/posts/reducer";
import { Post } from "../../../interfaces/post.interfaces";
import { Loading } from "../Misc/Loading";

type Props = {
    id: string;
    posts: Post[];
    getPostById: (id: string) => Promise<void>;
};

const mapStateToProps = (state: AppState) => ({
    posts: state.post
});

const SingleBlogPage: React.FC<Props> = ({ id, posts, getPostById }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [post, setPost] = useState<undefined | Post>(undefined);

    useEffect(() => {
        if (loaded === false) {
            const checkForPost = posts.find(post => String(post.id) === id);
            if (checkForPost) {
                setPost(checkForPost);
            } else {
                getPostById(id).then(() => {
                    const singlePost = posts.find(
                        post => String(post.id) === id
                    );
                    setPost(singlePost);
                });
            }
            setLoaded(false);
        }
    }, [id, loaded, setLoaded, posts]);

    if (loaded === false && post === undefined) {
        return <Loading />;
    }

    if (loaded === true && post === undefined) {
        return (
            <div style={{ textAlign: "center" }}>
                <h2>Not found.</h2>
                <p>The post you're searching for hasn't been found.</p>
            </div>
        );
    }

    return <div></div>;
};

export default connect(mapStateToProps, { getPostById })(SingleBlogPage);
