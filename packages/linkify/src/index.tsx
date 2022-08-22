import { ENTITY_TYPE } from 'draftail';
import source from './source/source';
import decorator from './decorator/decorator';
import LinkIcon from './linkIcon';

type LinkPlugin = {
  entityType: {
    icon?: any;
    type: string;
    schemes?: Array<string>;
    attributes?: Array<string>;
    decorator?: any;
    source: any;
    onPaste?: any;
  };
};

export default (): LinkPlugin => ({
  entityType: {
    icon: LinkIcon,
    //onPaste: onPaste,
    source,
    decorator,
    attributes: ['url'],
    schemes: ['http:', 'https:'],
    type: ENTITY_TYPE.LINK,
  },
});
