import { DraftHandleValue } from 'draft-js';
import { ENTITY_TYPE } from 'draftail';
import decorator, { DecoratorProps } from './decorator/decorator';
import LinkIcon from './linkIcon';
import source, { SourceProps } from './source/source';

type LinkPlugin = {
  entityType: {
    icon?: JSX.Element;
    type: string;
    schemes?: Array<string>;
    attributes?: Array<string>;
    decorator?: (props: DecoratorProps) => JSX.Element;
    source: (props: SourceProps) => JSX.Element;
    onPaste?: (text: string, html?: string) => DraftHandleValue;
  };
};

export default (): LinkPlugin => ({
  entityType: {
    icon: LinkIcon,
    source,
    decorator,
    attributes: ['url'],
    schemes: ['http:', 'https:'],
    type: ENTITY_TYPE.LINK,
  },
});
