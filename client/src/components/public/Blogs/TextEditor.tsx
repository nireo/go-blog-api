import React, { Component, Fragment } from 'react';
import { Editor } from 'slate-react';
import Icon from 'react-icons-kit';
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import { underline } from 'react-icons-kit/feather/underline';
import { list } from 'react-icons-kit/feather/list';
import { code } from 'react-icons-kit/feather/code';
import { Toolbar } from './Editor/Toolbar';
import { isKeyHotkey } from 'is-hotkey';

const DEFAULT_NODE = 'paragraph';
const isBoldHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey('mod+b');
const isItalicHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey('mod+i');
const isUnderlinedHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey(
  'mod+u'
);
const isCodeHotkey: (event: KeyboardEvent) => Boolean = isKeyHotkey('mod+`');

type Props = {
  value: any;
};

export default class TextEditor extends Component<Props> {
  public editor: any;
  state = {
    value: this.props.value
  };

  onChange = ({ value }: any) => {
    this.setState({ value });
  };

  ref = (editor: any) => {
    this.editor = editor;
  };

  onKeyDown = (event: any, editor: any, next: any) => {
    let mark;
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  renderMark = (props: any, editor: any, next: any) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'list':
        return (
          <ul {...attributes}>
            <li>{children}</li>
          </ul>
        );
      case 'underline':
        return <u {...attributes}>{children}</u>;
      default:
    }
  };

  renderBlock = (props: any, editor: any, next: any) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  hasBlock = (type: any) => {
    const { value } = this.state;
    return value.blocks.some((node: any) => node.type === type);
  };

  hasMark = (type: any) => {
    const { value } = this.state;
    return value.activeMarks.some((mark: any) => mark.type === type);
  };

  onMarkClick = (e: any, type: any) => {
    e.preventDefault();

    const value: any = this.state.value;

    const change: any = value.change().toggleMark(type);

    this.onChange(change);
  };

  onClickMark = (event: any, type: any) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  onClickBlock = (event: any, type: any) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some((block: any) => {
        return !!document.getClosest(
          block.key,
          (parent: any) => parent.type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };

  renderMarkButton = (type: any, icon: any) => {
    let iconToRender = null;
    switch (icon) {
      case 'bold':
        iconToRender = bold;
      case 'italic':
        iconToRender = italic;
      case 'list':
        iconToRender = list;
      case 'underline':
        iconToRender = underline;
      case 'code':
        iconToRender = code;
      default:
        iconToRender = null;
    }

    if (iconToRender === null) {
      return (
        <button
          className="tooltip-icon-button"
          onMouseDown={event => this.onClickMark(event, type)}
        >
          {icon}
        </button>
      );
    }

    return (
      <button
        className="tooltip-icon-button"
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon icon={iconToRender} />
      </button>
    );
  };

  renderBlockButton = (type: string, icon: any) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent: any = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    let iconToRender = null;
    switch (icon) {
      case 'bold':
        iconToRender = bold;
      case 'italic':
        iconToRender = italic;
      case 'list':
        iconToRender = list;
      case 'underline':
        iconToRender = underline;
      case 'code':
        iconToRender = code;
      default:
        iconToRender = null;
    }

    if (iconToRender === null) {
      return (
        <button
          className="tooltip-icon-button"
          onMouseDown={event => this.onClickBlock(event, type)}
        >
          {icon}
        </button>
      );
    }

    return (
      <button
        className="tooltip-icon-button"
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon icon={iconToRender} />
      </button>
    );
  };

  render() {
    return (
      <Fragment>
        <Toolbar>
          {this.renderMarkButton('bold', 'bold')}
          {this.renderMarkButton('italic', 'italic')}
          {this.renderMarkButton('list', 'list')}
          {this.renderMarkButton('underline', 'underline')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        </Toolbar>
        <Editor
          placeholder="Write your blog here..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          renderBlock={this.renderBlock}
          ref={this.ref}
        />
      </Fragment>
    );
  }
}
