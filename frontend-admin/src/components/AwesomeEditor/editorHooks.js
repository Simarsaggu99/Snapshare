/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Editor, Transforms, createEditor, Node, Element as SlateElement, Range } from 'slate';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  return imageExtensions.includes(ext);
};

export const insertImage = (editor, url) => {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

export const withImages = (editor, dispatch) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          const url = reader.result;
          const data1 = new FormData();
          data1.append('file', file);
          dispatch({
            type: 'common/uploadCommonContent',
            payload: { data: data1 },
          })
            .then((res) => {
              const resData = res.data;
              insertImage(editor, resData.url);
            })
            .catch((error) => {
              // reject(error);
            });
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const withMentions = (editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  return editor;
};

export const insertMention = (editor, obj) =>
  new Promise((resolve, reject) => {
    try {
      const mention = { type: 'mention', ...obj, children: [{ text: '' }] };
      Transforms.insertNodes(editor, mention);
      Transforms.move(editor);
      resolve();
    } catch (error) {
      reject();
    }
  });
