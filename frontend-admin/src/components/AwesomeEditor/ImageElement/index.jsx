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

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
          }}
        />
      </div>
      {children}
    </div>
  );
};

export default ImageElement;
