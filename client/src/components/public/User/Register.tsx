import React, { useState } from "react";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div>
            <div className="text-center">
                <h2>
                    <strong>Register</strong>
                </h2>
            </div>
            <div className="container">
                <form className="form-signin">
                    <div className="form-group">
                        <input
                            style={{ width: "100%", display: "inline-block" }}
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            style={{ width: "100%", display: "inline-block" }}
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="button"
                        style={{ width: "100%" }}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
