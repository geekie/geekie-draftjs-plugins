import React, { CSSProperties } from "react";

type LinkDecoratorProps = {
  entityKey: string,
  children: JSX.Element,
  onEdit: (key: string) => void,
};

const style : CSSProperties = {
  display: "inline-block",
  color: '#0F6DFF',
  textDecoration: 'underline'
}

const LinkDecorator = ({
  entityKey,
  children,
  onEdit,
}: LinkDecoratorProps) : JSX.Element => (
    <span style={style} onClick={() => onEdit(entityKey)}>
        {children}
    </span>
  );

export default LinkDecorator;
