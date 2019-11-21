import React, { Component, Fragment } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";

import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/feather/bold";
import { italic } from "react-icons-kit/feather/italic";
import { underline } from "react-icons-kit/feather/underline";
import { list } from "react-icons-kit/feather/list";
import { code } from "react-icons-kit/feather/code";
import { Toolbar } from "./Editor/Toolbar";
import { isKeyHotkey } from "is-hotkey";
import initialValue from "./value.json";

const DEFAULT_NODE = "paragraph";
const isBoldHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey("mod+b");
const isItalicHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey("mod+i");
const isUnderlinedHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey(
    "mod+u"
);
const isCodeHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey("mod+`");

export default class TextEditor extends Component {
    state = {
        value: Value.fromJSON(initialValue as any)
    };

    onChange = ({ value }: any) => {
        this.setState({ value });
    };

    onKeyDown = (event: any, editor: any, next: any) => {
        let mark;
        if (isBoldHotkey(event)) {
            mark = "bold";
        } else if (isItalicHotkey(event)) {
            mark = "italic";
        } else if (isUnderlinedHotkey(event)) {
            mark = "underlined";
        } else if (isCodeHotkey(event)) {
            mark = "code";
        } else {
            return next();
        }

        event.preventDefault();
        editor.toggleMark(mark);
    };

    renderMark = (props: any, editor: any, next: any) => {
        const { children, mark, attributes } = props;

        switch (props.mark.type) {
            case "bold":
                return <strong {...attributes}>{children}</strong>;
            case "italic":
                return <em {...attributes}>{children}</em>;
            case "code":
                return <code {...attributes}>{children}</code>;
            case "list":
                return (
                    <ul {...attributes}>
                        <li>{children}</li>
                    </ul>
                );
            case "underline":
                return <u {...attributes}>{children}</u>;
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
