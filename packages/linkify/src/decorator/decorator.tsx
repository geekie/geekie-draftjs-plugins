import { ContentState } from 'draft-js';
import React, { useState, useRef, useEffect } from 'react';
import { defaultTheme } from '../theme';
import LinkIcon from '../linkIcon';

export type DecoratorProps = {
  entityKey: string;
  contentState: ContentState;
  children: JSX.Element;
  onEdit: (key: string) => void;
  onRemove: (key: string) => void;
};

const LinkDecorator = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
}: DecoratorProps): JSX.Element => {
  const { url } = contentState.getEntity(entityKey).getData();
  const shortenedUrl = url.replace('http://', '').replace('https://', '');
  const [showTooltip, setShowTooltip] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        divRef.current &&
        !divRef.current.contains(event.target as HTMLElement)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [divRef]);
  return (
    <span
      title={url}
      className={`GeekieLink-link ${defaultTheme.styleLinkSpan}`}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {showTooltip && (
        <div
          ref={divRef}
          className={`GeekieLink-link-tooltip ${defaultTheme.styleLinkDivTooltip} ${defaultTheme.styleGlobal}`}
        >
          <a
            target={'_blank'}
            title={url}
            href={url}
            className={`GeekieLink-link-tooltip-a ${defaultTheme.styleLinkTooltip}`}
            rel="noreferrer"
          >
            <span
              className={`GeekieLink-link-tooltip-icon ${defaultTheme.styleLinkTooltipIcon}`}
            >
              {LinkIcon}
            </span>
            {shortenedUrl}
          </a>

          <span
            className={`GeekieLink-link-tooltip-editar ${defaultTheme.styleLinkTooltip} ${defaultTheme.styleLinkTooltipText}`}
            onClick={() => onEdit(entityKey)}
          >
            {'Editar'}
          </span>

          <span
            className={`GeekieLink-link-tooltip-remover ${defaultTheme.styleLinkTooltip} ${defaultTheme.styleLinkTooltipText}`}
            onClick={() => onRemove(entityKey)}
          >
            {'Remover'}
          </span>
        </div>
      )}
      {children}
    </span>
  );
};

export default LinkDecorator;
