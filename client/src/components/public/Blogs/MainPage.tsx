import React, { useEffect } from "react";
import { AppState } from "../../../store/index";
import { connect } from "react-redux";
import { Post } from "../../../interfaces/post.interfaces";
import { initPosts } from "../../../store/posts/actions";
import { PostActionTypes } from "../../../store/posts/types";

const mapStateToProps = (state: AppState) => ({
    posts: state.post.posts
});

type Props = {
    posts: Post[];
    initPosts: () => Promise<PostActionTypes>;
};

const MainPage: React.FC<Props> = ({ posts, initPosts }) => {
    useEffect(() => {
        if (posts.length < 1) {
            initPosts();
        }
    }, posts);

    return <div></div>;
};

export default connect(mapStateToProps, { initPosts })(MainPage);
