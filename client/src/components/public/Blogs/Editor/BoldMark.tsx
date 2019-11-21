import React from "react";

type Props = {
    children: React.ReactNode;
};

export const BoldMark: React.FC<Props> = ({ children }) => {
    return <strong>{children}</strong>;
};
