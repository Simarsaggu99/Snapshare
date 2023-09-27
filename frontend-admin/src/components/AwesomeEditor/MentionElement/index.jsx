import { css } from '@emotion/css';
import React from 'react';
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from 'slate-react';

const MentionElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        cursor: 'pointer',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      @{element.displayName}
      {children}
    </span>
  );
};
export default MentionElement;
