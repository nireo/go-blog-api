import React, { ReactNode } from 'react';

type Props = {
  handleClose: () => void;
  show: boolean;
  children: ReactNode;
};

const Modal: React.FC<Props> = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <div className="modal-main">
        <div style={{ padding: '2rem' }}>{children}</div>
        <div
          className="container"
          style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
        >
          <div>
            <button className="button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
