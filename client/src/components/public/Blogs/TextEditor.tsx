import React, { Component, Fragment } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";

import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/feather/bold";
import { italic } from "react-icons-kit/feather/italic";
import { underline } from "react-icons-kit/feather/underline";
import { list } from "react-icons-kit/feather/list";
import { code } from "react-icons-kit/feather/code";
import { BoldMark } from "./Editor/BoldMark";
import { ItalicMark } from "./Editor/ItalicMark";
import { Toolbar } from "./Editor/Toolbar";

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: "block",
                type: "paragraph",
                nodes: [
                    {
                        object: "text",
                        leaves: [
                            {
                                text: "Start here..."
                            }
                        ]
                    }
                ]
            }
        ]
    }
} as any);

export default class TextEditor extends Component {
    state = {
        value: initialValue
    };

    onChange = ({ value }: any) => {
        this.setState({ value });
    };

    onKeyDown = (e: any, change: any) => {
        console.log(change);
        if (!e.ctrlKey) {
            console.log(e.key);
            return;
        }
        e.preventDefault();

        switch (e.key) {
            case "b": {
                change.toggleMark("bold");
                return true;
            }
            case "i": {
                change.toggleMark("italic");
                return true;
            }
            case "c": {
                change.toggleMark("code");
                return true;
            }
            case "l": {
                change.toggleMark("list");
                return true;
            }
            case "u": {
                change.toggleMark("underline");
                return true;
            }
            default:
                return;
        }
    };

    renderMark = (props: any) => {
        switch (props.mark.type) {
            case "bold":
                return <BoldMark {...props} />;
            case "italic":
                return <ItalicMark {...props} />;
            case "code":
                return <code {...props.attributes}>{props.children}</code>;
            case "list":
                return (
                    <ul {...props.attributes}>
                        <li>{props.children}</li>
                    </ul>
                );
            case "underline":
                return <u {...props.attributes}>{props.children}</u>;
            default:
        }
    };

    onMarkClick = (e: any, type: any) => {
        e.preventDefault();

        const value: any = this.state.value;

        const change: any = value.change().toggleMark(type);

        this.onChange(change);
    };

    render() {
        return (
            <Fragment>
                <Toolbar>
                    <button
                        className="tooltip-icon-button"
                        onPointerDown={e => this.onMarkClick(e, "bold")}
                    >
                        <Icon icon={bold} />
                    </button>
                    <button
                        className="tooltip-icon-button"
                        onPointerDown={e => this.onMarkClick(e, "italic")}
                    >
                        <Icon icon={italic} />
                    </button>
                    <button
                        className="tooltip-icon-button"
                        onPointerDown={e => this.onMarkClick(e, "list")}
                    >
                        <Icon icon={list} />
                    </button>
                    <button
                        className="tooltip-icon-button"
                        onPointerDown={e => this.onMarkClick(e, "underline")}
                    >
                        <Icon icon={underline} />
                    </button>
                    <button
                        className="tooltip-icon-button"
                        onPointerDown={e => this.onMarkClick(e, "code")}
                    >
                        <Icon icon={code} />
                    </button>
                </Toolbar>
                <Editor
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    renderMark={this.renderMark}
                />
            </Fragment>
        );
    }
}
