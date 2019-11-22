import React, { useState, FormEvent } from "react";
import { connect } from "react-redux";
import { register } from "../../../store/user/reducer";
import { UserAction } from "../../../interfaces/user.interfaces";

type Props = {
    hideRegisterWindow: () => void;
    register: (credentials: UserAction) => void;
};

const Register: React.FC<Props> = ({ hideRegisterWindow }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleRegistration = (event: FormEvent<HTMLFormElement>) => {
        // stop reloading site after submit
        event.preventDefault();
        const credentials: UserAction = {
            username,
            password
        };
        console.log("hello");
        register(credentials);
    };

    return (
        <div>
            <div className="text-center">
                <h2>
                    <strong>Register</strong>
                </h2>
            </div>
            <div className="container">
                <form className="form-signin" onSubmit={handleRegistration}>
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
                <button
                    style={{ width: "100%" }}
                    className="button"
                    onClick={hideRegisterWindow}
                >
                    Already a user? Login here.
                </button>
            </div>
        </div>
    );
};

export default connect(null, { register })(Register);
