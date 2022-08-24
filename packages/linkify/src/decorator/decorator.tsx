import React, { CSSProperties } from 'react';

export type DecoratorProps = {
  entityKey: string;
  children: JSX.Element;
  onEdit: (key: string) => void;
};

const style: CSSProperties = {
  display: 'inline-block',
  color: '#0F6DFF',
  textDecoration: 'underline',
};

const LinkDecorator = ({
  entityKey,
  children,
  onEdit,
}: DecoratorProps): JSX.Element => (
  <span
    className={`GeekieLink-link`}
    style={style}
    onClick={() => onEdit(entityKey)}
  >
    {children}
  </span>
);

export default LinkDecorator;
