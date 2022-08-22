import { ENTITY_TYPE } from 'draftail';
import source from './source/source';
import decorator from './decorator/decorator';
import LinkIcon from './linkIcon';

//todo tipar
export default (config: any) => {
  return {
    entityType: {
      icon: LinkIcon,
      //onPaste: onPaste,
      source,
      decorator,
      attributes: ['url'],
      schemes: ['http:', 'https:'],
      type: ENTITY_TYPE.LINK,
    },
  };
};
