import React from "react";

type Props = {
    children: React.ReactNode;
};

export const Toolbar: React.FC<Props> = ({ children }) => {
    return <div className="format-toolbar">{children}</div>;
};
