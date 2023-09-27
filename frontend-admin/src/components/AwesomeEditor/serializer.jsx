import { Popover } from 'antd';
import { css } from '@emotion/css';
import escapeHtml from 'escape-html';
import { Node, Text } from 'slate';
import ImageElement from './ImageElement';
import ProfileCard from './ProfileCard';

export const serialize = (node) => {
  if (Text.isText(node)) {
    let nodee = node.text;
    if (node.bold) {
      nodee = <strong>{nodee}</strong>;
    }
    if (node.italic) {
      nodee = <em>{nodee}</em>;
    }
    if (node.underline) {
      nodee = <u>{nodee}</u>;
    }
    if (node.code) {
      nodee = <code>{nodee}</code>;
    }
    return nodee;
  }

  const children = node.children.map((n) => serialize(n));

  switch (node.type) {
    case 'quote':
      return (
        <blockquote>
          <p>{children}</p>
        </blockquote>
      );
    case 'paragraph':
      return <p>{children}</p>;
    case 'link':
      return <a href={escapeHtml(node.url)}>{children}</a>;
    case 'block-quote':
      return <blockquote>{children}</blockquote>;
    case 'bulleted-list':
      return <ul>{children}</ul>;
    case 'heading-one':
      return <h1>{children}</h1>;
    case 'heading-two':
      return <h2>{children}</h2>;
    case 'list-item':
      return <li>{children}</li>;
    case 'numbered-list':
      return <ol>{children}</ol>;
    case 'image': {
      return (
        <div contentEditable={false}>
          <img
            src={node.url}
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '20em',
            }}
          />
        </div>
      );
    }
    case 'mention':
      return (
        <Popover overlayClassName="app-popup" content={<ProfileCard data={node || {}} />}>
          <span
            contentEditable={false}
            style={{
              padding: '3px 3px 2px',
              margin: '0 1px',
              verticalAlign: 'baseline',
              display: 'inline-block',
              borderRadius: '4px',
              backgroundColor: '#eee',
              fontSize: '0.9em',
            }}
          >
            @{node.displayName}
            {children}
          </span>
        </Popover>
      );
    default:
      return <p>{children}</p>;
  }
};
