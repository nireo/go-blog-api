import React from "react";

type Props = {
    children: React.ReactNode;
};

export const ItalicMark: React.FC<Props> = ({ children }) => {
    return <i>{children}</i>;
};
