import React, { ReactNode } from "react";

type Props = {
    handleClose: () => void;
    show: boolean;
    children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ handleClose, show, children }) => {
    const showHideClassName = show
        ? "modal display-block"
        : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <div className="container">
                    <button className="button" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Modal;
