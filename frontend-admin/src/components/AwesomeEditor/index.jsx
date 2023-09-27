/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo, useState, useRef, useEffect, Suspense } from 'react';
import ReactDOMServer from 'react-dom/server';

import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';

import { Editor, Transforms, createEditor, Element as SlateElement, Range } from 'slate';
import { withHistory } from 'slate-history';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { Button, Icon, Toolbar, Portal } from './components';
import ImageElement from './ImageElement';
import MentionElement from './MentionElement';
import MarkButton, { toggleMark } from './MarkButton';
import { insertMention, withImages, withMentions } from './editorHooks';
import { serialize } from './serializer';
import { Spin } from 'antd';

const iv = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const AwesomeEditor = ({
  dispatch,
  members,
  loggedInuser,
  onAddMention,
  readOnly,
  test,
  onChange,
  loading,
  initialValue,
  placeholder,
  type,
}) => {
  const ref = useRef();
  const [value, setValue] = useState(initialValue || iv);
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const editor = useMemo(
    () => withMentions(withImages(withReact(withHistory(createEditor())), dispatch)),
    [],
  );

  const fetchMembersService = ({ keyword, startIndex, fetchSize, sortBy }) => {
    return dispatch({
      type: 'orgMembers/listOrganizationMembers',
      payload: {
        accountId: loggedInuser?.organization?.id,
        searchCriteria: { keyword, startIndex, fetchSize, sortBy },
      },
    });
  };
  const debouncedFetchMembersService = debounce(fetchMembersService, 500);

  useEffect(() => {
    onChange({
      JSONText: value,
      HTMLText: ReactDOMServer.renderToStaticMarkup(serialize({ children: value })),
    });
    return () => {};
  }, [value]);

  const onKeyDown = useCallback(
    (event) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= members?.records?.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? members?.records?.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, members?.records?.[index]).then(() => {
              if (onAddMention) onAddMention(members?.records?.[index]);
            });
            setTarget(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(null);
            break;

          default:
            break;
        }
      }
    },
    [index, search, target, members],
  );
  useEffect(() => {
    if (target && members?.records?.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [members, editor, index, search, target]);

  return (
    <>
      <div className="border rounded p-5">
        <Slate
          editor={editor}
          value={value}
          onChange={(value1) => {
            setValue(value1);
            const { selection } = editor;
            if (selection && Range.isCollapsed(selection)) {
              const [start] = Range.edges(selection);
              const wordBefore = Editor.before(editor, start, { unit: 'word' });
              const before = wordBefore && Editor.before(editor, wordBefore);
              const beforeRange = before && Editor.range(editor, before, start);
              const beforeText = beforeRange && Editor.string(editor, beforeRange);
              const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
              const after = Editor.after(editor, start);
              const afterRange = Editor.range(editor, start, after);
              const afterText = Editor.string(editor, afterRange);
              const afterMatch = afterText.match(/^(\s|$)/);

              if (beforeMatch && afterMatch) {
                setTarget(beforeRange);
                setSearch(beforeMatch[1]);
                debouncedFetchMembersService({
                  keyword: beforeMatch[1],
                  startIndex: 0,
                  fetchSize: 10,
                  sortBy: '-createdDate',
                });
                setIndex(0);
                return;
              }
            }

            setTarget(null);
          }}
        >
          {!readOnly && (
            <Toolbar>
              <MarkButton format="bold" icon="format_bold" />
              <MarkButton format="italic" icon="format_italic" />
              <MarkButton format="underline" icon="format_underlined" />
              <MarkButton format="code" icon="code" />
              <BlockButton format="heading-one" icon="looks_one" />
              <BlockButton format="heading-two" icon="looks_two" />
              <BlockButton format="block-quote" icon="format_quote" />
              <BlockButton format="numbered-list" icon="format_list_numbered" />
              <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            </Toolbar>
          )}
          <Editable
            rows={4}
            style={{
              minHeight: type === 'descriptionForm' ? 80 : 120,
            }}
            readOnly={readOnly}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              onKeyDown(event);
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
          {!readOnly && target && members?.records?.length > 0 && (
            <Portal>
              <div
                ref={ref}
                style={{
                  top: '-9999px',
                  left: '-9999px',
                  position: 'absolute',
                  zIndex: 9999,
                  padding: '3px',
                  background: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                }}
              >
                <Spin spinning={loading}>
                  {members?.records?.map(({ id, displayName }, i) => (
                    <div
                      key={id}
                      style={{
                        padding: '1px 3px',
                        borderRadius: '3px',
                        background: i === index ? '#B4D5FF' : 'transparent',
                      }}
                    >
                      {displayName}
                    </div>
                  ))}
                </Spin>
              </div>
            </Portal>
          )}
        </Slate>
      </div>
      {test && <div className="p-10">{serialize({ children: value })}</div>}{' '}
      {test && (
        <div className="p-10">
          {ReactDOMServer.renderToStaticMarkup(serialize({ children: value }))}
        </div>
      )}
    </>
  );
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
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
    case 'image':
      return <ImageElement {...props} />;
    case 'mention':
      return <MentionElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default connect(({ user, loading: { effects } }) => ({
  loggedInuser: user.currentUser,
  loading: effects['orgMembers/listOrganizationMembers'],
}))(AwesomeEditor);
