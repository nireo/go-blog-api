import React from "react";

type Props = {
    isActive: boolean;
    children: React.ReactNode;
};

export const Button: React.FC<Props> = ({ isActive, children }) => {
    if (isActive) {
        return (
            <button className="tooltip-icon-button active">{children}</button>
        );
    }
    return <button className="tooltip-icon-button">{children}</button>;
};
