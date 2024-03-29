import React, { useRef, useState, useEffect } from 'react';
import { ENTITY_TYPE } from 'draftail';
import Draggable from 'react-draggable';
import {
  Modifier,
  EditorState,
  SelectionState,
  EditorChangeType,
  EntityInstance,
} from 'draft-js';

import { defaultTheme } from '../theme';

export type SourceProps = {
  entity: EntityInstance;
  editorState: EditorState;
  onComplete: (e: EditorState) => void;
  onClose: () => void;
  textDirectionality: string;
};

const LinkSource = (props: SourceProps): JSX.Element => {
  const { entity, editorState, onComplete, onClose, textDirectionality } =
    props;

  const inputContentRef = useRef<HTMLInputElement>(null);
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [url, setUrl] = useState(entity ? entity.getData().url : '');
  const [content, setContent] = useState(getSelectionText(editorState));
  const [clickedOutside, setClickedOutside] = useState(false);

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

  const handleChangeContent = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target instanceof HTMLInputElement) {
      setContent(e.target.value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as HTMLElement)
      ) {
        if (clickedOutside) onClose();
      }
      setClickedOutside(true);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formRef, clickedOutside]);

  return (
    <Draggable cancel={'input, button'}>
      <form
        dir={textDirectionality === 'RTL' ? 'rtl' : undefined}
        className={`GeekieLink-form ${defaultTheme.styleForm} ${defaultTheme.styleGlobal}`}
        onSubmit={handleConfirm}
        ref={formRef}
      >
        <label
          className={`GeekieLink-label ${defaultTheme.styleLabel}`}
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
          className={`GeekieLink-input ${defaultTheme.styleInput}`}
        />

        <label
          className={`GeekieLink-label form-field-url ${defaultTheme.styleLabel}`}
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
          className={`GeekieLink-input ${defaultTheme.styleInput}`}
        />

        <button
          disabled={!content || !url}
          type="submit"
          className={`GeekieLink-button ${defaultTheme.styleButton}`}
        >
          Ok
        </button>
        <button
          className={`GeekieLink-button ${defaultTheme.styleButton}`}
          onClick={handleRequestClose}
        >
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
  const start = selection.getStartOffset();
  const end = start + content.length;

  const blockMap = newEditorState.getCurrentContent().getBlockMap();
  const blockKey = blockMap.has(selection.getAnchorKey())
    ? selection.getAnchorKey()
    : selection.getFocusKey();

  selection = selection.merge({
    anchorKey: blockKey,
    anchorOffset: start,
    focusKey: blockKey,
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

    const state = contentState.createEntity(ENTITY_TYPE.LINK, 'MUTABLE', {
      targetOption: '_blank',
      url: finalUrl,
    });

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
  const contentState = editorState.getCurrentContent();
  const anchorKey = selection.getAnchorKey();
  const focusKey = selection.getFocusKey();
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const isBackward = selection.getIsBackward();
  if (anchorKey === focusKey) {
    const currentContentBlock = contentState.getBlockForKey(anchorKey);
    return currentContentBlock.getText().slice(start, end);
  }
  let selectedText = contentState
    .getBlockForKey(isBackward ? focusKey : anchorKey)
    .getText()
    .slice(start);
  selectedText += contentState
    .getBlockForKey(isBackward ? anchorKey : focusKey)
    .getText()
    .slice(0, end);
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
