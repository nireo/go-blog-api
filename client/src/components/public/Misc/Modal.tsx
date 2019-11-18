import React, { ReactNode } from "react";

type Props = {
    handleClose: () => void;
    show: boolean;
    children: {
        header?: ReactNode;
        content: ReactNode;
    };
};

const Modal: React.FC<Props> = ({ handleClose, show, children }) => {
    const showHideClassName = show
        ? "model display-block"
        : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <button onClick={handleClose}>close</button>
            </section>
        </div>
    );
};

export default Modal;
