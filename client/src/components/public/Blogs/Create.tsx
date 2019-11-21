import React, { useState } from "react";
import TextEditor from "./TextEditor";

const Create = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [text, setText] = useState<string>("");
    return (
        <div className="container">
            <div>
                <input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    style={{
                        border: "none",
                        fontSize: "36px",
                        fontFamily: "Raleway sans-serif"
                    }}
                    placeholder="Title..."
                />
            </div>
            <div>
                <input
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                    style={{
                        border: "none",
                        fontSize: "20px",
                        fontFamily: "Raleway sans-serif",
                        color: "#6c757d"
                    }}
                    placeholder="Description..."
                />
            </div>
            <hr />
            <div>
                <textarea
                    value={text}
                    onChange={({ target }) => setText(target.value)}
                    style={{
                        border: "none",
                        fontSize: "18px",
                        fontFamily: "Merriweather, serif",
                        width: "100%"
                    }}
                    placeholder="Text..."
                    rows={50}
                />
            </div>
            <TextEditor />
        </div>
    );
};

export default Create;
