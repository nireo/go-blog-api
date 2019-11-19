import React, { useState } from "react";
import Modal from "../Misc/Modal";

const Register: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);
    const hideModal = () => {
        setShow(true);
    };

    return (
        <Modal show={show} handleClose={hideModal}>
            {{
                content: <div className="container">Registeration form</div>
            }}
        </Modal>
    );
};

export default Register;
