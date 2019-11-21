import React, { useEffect, useState, FormEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { getPostById, updatePost } from "../../../store/posts/reducer";
import { Post } from "../../../interfaces/post.interfaces";
import { Loading } from "../Misc/Loading";
import TextEditor from "./TextEditor";

type Props = {
    id: string;
    posts: Post[];
    getPostById: (id: string) => Promise<void>;
    updatePost: (post: Post, id: string) => Promise<void>;
};

const mapStateToProps = (state: AppState) => ({
    posts: state.post
});

const SingleBlogPage: React.FC<Props> = ({
    id,
    posts,
    getPostById,
    updatePost
}) => {
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

    const addLike = (event: FormEvent<HTMLFormElement>) => {
        // prevent site from reloading when submitting.
        event.preventDefault();
        if (!post) {
            // not necessary, but typescript complains
            return;
        }

        const postWithLike = { ...post, likes: post.likes + 1 };
        updatePost(postWithLike, String(post.id));
    };

    return (
        <div className="container mt-4">
            {post !== undefined && (
                <div>
                    <div className="text-center">
                        <h2 style={{ fontSize: "36px" }}>
                            <strong>{post.title}</strong>
                        </h2>
                        <h6 className="text-muted" style={{ fontSize: "20px" }}>
                            {post.description}
                        </h6>
                    </div>

                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <hr />
                            <p style={{ fontSize: "18px" }}>{post.text}</p>
                            <hr />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <div className="text-center">
                        <p>Posted: {post.created_at}</p>
                        <p>Likes: {post.likes}</p>
                        <form onSubmit={addLike}>
                            <button className="button">Like</button>
                        </form>
                    </div>
                </div>
            )}
            <h2> WRITE HERE </h2>
            <TextEditor />
        </div>
    );
};

export default connect(mapStateToProps, { getPostById, updatePost })(
    SingleBlogPage
);
