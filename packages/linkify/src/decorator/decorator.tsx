import React, {CSSProperties} from "react";
import { EditorState, Modifier, RichUtils, ContentState } from "draft-js";


type LinkDecoratorProps = {
  entityKey: any,
  contentState: ContentState,
  children: any,
  onEdit: () => void,
  onRemove: () => void,
  textDirectionality: any,
};

const LinkDecorator = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
  textDirectionality
}: LinkDecoratorProps) : JSX.Element => {
  const { url, linkType } = contentState.getEntity(entityKey).getData();
  const style : CSSProperties = {
     display: "inline-block",
  } 

  return (
    <div style={style}>
      <a target={"_blank"} href={url} onClick={onEdit.bind(null, entityKey)} rel="noreferrer">
        {children}
      </a>
    </div>
  );
};

//<button onClick={onEdit.bind(null, entityKey)}> Editar </button>
//
export default LinkDecorator;
