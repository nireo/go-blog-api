import React, { useEffect } from "react";
import { AppState } from "../../../store/index";
import { connect } from "react-redux";
import { Post } from "../../../interfaces/post.interfaces";
import { initPosts } from "../../../store/posts/reducer";
import { Loading } from "../Misc/Loading";

const mapStateToProps = (state: AppState) => ({
    posts: state.post
});

type Props = {
    posts: Post[];
    initPosts: any;
};

const MainPage: React.FC<Props> = ({ posts, initPosts }) => {
    useEffect(() => {
        if (posts.length < 1) {
            initPosts();
        }
    }, [posts, initPosts]);
    if (posts.length === 0) {
        return <Loading />;
    }

    return (
        <div style={{ textAlign: "center" }}>
            {posts.map(post => (
                <div>
                    <p>{post.text}</p>
                    <p>posted by: {post.user.username}</p>
                </div>
            ))}
        </div>
    );
};

export default connect(mapStateToProps, { initPosts })(MainPage);
