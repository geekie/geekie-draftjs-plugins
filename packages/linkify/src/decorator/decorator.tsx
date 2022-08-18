import React from "react";
import { EditorState, Modifier, RichUtils } from "draft-js";

const LinkDecorator = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
  textDirectionality
}: any) => {
  const { url, linkType } = contentState.getEntity(entityKey).getData();

  return (
    <div style={{ display: "inline-block" }}>
      <a target={"_blank"} href={url} onClick={onEdit.bind(null, entityKey)}>
        {children}
      </a>
    </div>
  );
};

//<button onClick={onEdit.bind(null, entityKey)}> Editar </button>
//
export default LinkDecorator;
