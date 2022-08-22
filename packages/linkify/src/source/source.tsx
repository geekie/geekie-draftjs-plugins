import React, { Component, CSSProperties } from "react";
import { ENTITY_TYPE } from "draftail";
import { Modifier, EditorState, SelectionState, EditorChangeType } from "draft-js";

type State = {
  url: string;
  content: string;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
class LinkSource extends Component<any, State> {
  inputContentRef?: HTMLInputElement | null;
  inputUrlRef?: HTMLInputElement | null;

  constructor(props: any) {
    super(props);

    const { entity, editorState } = this.props;
    const selectionText = getSelectionText(editorState);

    const state = {
      url: "",
      content: selectionText,
    };

    if (entity) {
      const data = entity.getData();
      state.url = data.url;
      state.content = selectionText;
    }

    this.state = state;

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChangeURL = this.onChangeURL.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
  }

  onConfirm(e: React.FormEvent<HTMLFormElement>) : void {
    const { editorState, onComplete } = this.props;
    const { url, content } = this.state;
    e.preventDefault();
    const newEditorState = editLinkEntity(content, url, editorState);
    onComplete(newEditorState);
  }

  onRequestClose(e: React.SyntheticEvent) : void {
    const { onClose } = this.props;
    e.preventDefault();
    onClose();
  }

  onChangeURL(e: React.ChangeEvent<HTMLInputElement>) : void {
    if (e.target instanceof HTMLInputElement) {
      const url = e.target.value;
      this.setState({ url });
    }
  }

  onChangeContent(e: React.ChangeEvent<HTMLInputElement>) : void {
    if (e.target instanceof HTMLInputElement) {
      const content = e.target.value;
      this.setState({ content });
    }
  }
  //todo tipar
  render() : any {
    const { textDirectionality } = this.props;
    const { url, content } = this.state;
    const styleForm : CSSProperties = {
          pointerEvents: "all",
          border: "1px solid #F1F1F1",
          boxShadow: "2px 3px 8px rgba(0, 0, 0, 0.3)",
          fontFamily: "Lato, Arial",
          width: 276,
          textAlign: "center",
    };
    const styleLabel : CSSProperties = {
          display: "block",
          fontWeight: 700,
          fontFamily: "Lato, Arial",
          fontSize:14,
          lineHeight:"17px",
          marginTop: "15px",
          marginLeft: "16px",
          textAlign: "left",
    };
    const styleInput : CSSProperties = {
          display: "block",
          marginTop: "6px",
          border: "1px solid #D3D7DE",
          borderRadius: "4px",
          width:244,
          height:32,
          marginLeft: "16px",
    };
    const styleButton : CSSProperties = {
        display: "inline-block",
        width: 74,
        height: 30,
        margin: "10px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F1F1",
    };

      
    return (
      <form
        dir={textDirectionality === "RTL" ? "rtl" : undefined}
        className="LinkSource"
        onSubmit={this.onConfirm}
        style={styleForm}
      >
        
        <label 
          className={"form-field-content"} 
          style={styleLabel} 
          htmlFor={"geekie-link-id-content"} >
          Texto
        </label>
        <input
          ref={(inputContentRef) => {
            this.inputContentRef = inputContentRef;
          }}
          type="text"
          onChange={this.onChangeContent}
          value={content}
          placeholder="Conteúdo"
          id="geekie-link-id-content"
          style={styleInput}
        />

        

        <label 
          className={"form-field-url"} 
          style={styleLabel} 
          htmlFor={"geekie-link-id-url"} >
          Link
        </label>
        <input
          ref={(inputUrlRef) => {
            this.inputUrlRef = inputUrlRef;
          }}
          type="text"
          onChange={this.onChangeURL}
          value={url}
          placeholder="www.example.com"
          id="geekie-link-id-url"
          style={styleInput}
        />


        <button type="submit" style = {styleButton}>Ok</button>
        <button style = {styleButton}>Cancelar</button>
      </form>
    );
  }
}



function editLinkEntity(content:string, url:string, editorState:EditorState) : EditorState {
  let selection = editorState.getSelection();
  let newEditorState = editorState;
  newEditorState = editText(newEditorState,selection,content);

  //seleciona texto se foi alterado
  const start = Math.min(selection.getStartOffset(),selection.getEndOffset());
  const end = start + content.length;
  
  selection = selection.merge({
    anchorOffset: start,
    focusOffset: end,
    isBackward: false,
  });
  
  newEditorState = addLink(newEditorState,selection,url);
  return newEditorState;
}

function addLink(editorState:EditorState, selection:SelectionState,  url:string) : EditorState {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  if (url!=="") {//TODO(tumais) - validar url e complementar com https:// os casos necessários
    const state = contentState.createEntity(
      ENTITY_TYPE.LINK,
      "MUTABLE",
      { url }
    );

    const entityKey = contentState.getLastCreatedEntityKey();

    const newContentState = Modifier.applyEntity(
      state,
      selection,
      entityKey
    );
    
    newEditorState = EditorState.push(editorState, newContentState, "apply-entity");
  }
  return newEditorState;
}

function getSelectionText(editorState:EditorState) : string{
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const anchorKey = selection.getAnchorKey();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);
  return selectedText;
}

function editText(editorState:EditorState, selection:SelectionState, content:string) : EditorState{
  const contentState = editorState.getCurrentContent();
  const newContentState = Modifier.replaceText(contentState, selection, content);
  const newEditorState = EditorState.push(editorState, newContentState, 'replace-text' as EditorChangeType);
  return newEditorState;
}

export default LinkSource;
