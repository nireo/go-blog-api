import React, { useState } from "react";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div>
            <h2>
                <strong>Register</strong>
            </h2>
        </div>
    );
};

export default Register;
