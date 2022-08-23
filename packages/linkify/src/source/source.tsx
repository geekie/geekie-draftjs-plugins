import React, { useEffect, useRef, useState } from 'react';
import { ENTITY_TYPE } from 'draftail';
import Draggable from 'react-draggable';
import {
  Modifier,
  EditorState,
  SelectionState,
  EditorChangeType,
} from 'draft-js';

import { defaultTheme } from '../theme';


export type SourceProps = {
  entity: {
    getData: () => {
      url: string;
    };
  };
  editorState: EditorState;
  onComplete: (e: EditorState) => void;
  onClose: () => void;
  textDirectionality: string;
}

const LinkSource = (props: SourceProps): JSX.Element => {
  const { entity, editorState, onComplete, onClose, textDirectionality } = props;

  const inputContentRef = useRef<HTMLInputElement>(null);
  const inputUrlRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState(entity ? entity.getData().url : '');
  const [content, setContent] = useState(getSelectionText(editorState));

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newEditorState = editLinkEntity(content, url, editorState);
    onComplete(newEditorState);
  };

  const handleRequestClose = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    onClose();
  };

  const handleChangeURL = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target instanceof HTMLInputElement) {
      setUrl(e.target.value);
    }
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target instanceof HTMLInputElement) {
      setContent(e.target.value);
    }
  };

  return (
    <Draggable>
      <form
        dir={textDirectionality === 'RTL' ? 'rtl' : undefined}
        className={`LinkSource ${defaultTheme.styleForm}`}
        onSubmit={handleConfirm}
      >
        <label
          className={`form-field-url ${defaultTheme.styleLabel}`}
          htmlFor={'geekie-link-id-content'}
        >
          Texto
        </label>
        <input
          ref={inputContentRef}
          type="text"
          onChange={handleChangeContent}
          value={content}
          id="geekie-link-id-content"
          className={`${defaultTheme.styleInput}`}
        />

        <label
          className={`form-field-url ${defaultTheme.styleLabel}`}

          htmlFor={'geekie-link-id-url'}
        >
          Link
        </label>
        <input
          ref={inputUrlRef}
          type="text"
          onChange={handleChangeURL}
          value={url}
          id="geekie-link-id-url"
          className={`${defaultTheme.styleInput}`}
        />

        <button type="submit" className={`${defaultTheme.styleButton}`}>
          Ok
        </button>
        <button className={`${defaultTheme.styleButton}`} onClick={handleRequestClose}>
          Cancelar
        </button>
      </form>
    </Draggable>
  );
};

function editLinkEntity(
  content: string,
  url: string,
  editorState: EditorState
): EditorState {
  let selection = editorState.getSelection();
  let newEditorState = editorState;
  newEditorState = editText(newEditorState, selection, content);

  //seleciona texto se foi alterado
  const start = Math.min(selection.getStartOffset(), selection.getEndOffset());
  const end = start + content.length;

  selection = selection.merge({
    anchorOffset: start,
    focusOffset: end,
    isBackward: false,
  });

  newEditorState = addLink(newEditorState, selection, url);
  return newEditorState;
}

function addLink(
  editorState: EditorState,
  selection: SelectionState,
  url: string
): EditorState {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  if (url !== '') {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://'))
      finalUrl = `https://${url}`;

    const state = contentState.createEntity(
      ENTITY_TYPE.LINK,
      'MUTABLE',
      {
        targetOption: '_blank',
        url: finalUrl
      }
    );

    const entityKey = contentState.getLastCreatedEntityKey();

    const newContentState = Modifier.applyEntity(state, selection, entityKey);

    newEditorState = EditorState.push(
      editorState,
      newContentState,
      'apply-entity'
    );
  }
  return newEditorState;
}

function getSelectionText(editorState: EditorState): string {
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const anchorKey = selection.getAnchorKey();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);
  return selectedText;
}

function editText(
  editorState: EditorState,
  selection: SelectionState,
  content: string
): EditorState {
  const contentState = editorState.getCurrentContent();
  const newContentState = Modifier.replaceText(
    contentState,
    selection,
    content
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'replace-text' as EditorChangeType
  );
  return newEditorState;
}

export default LinkSource;
