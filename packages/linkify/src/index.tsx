import { ENTITY_TYPE } from "draftail";
import source from "./source/source";
import decorator from "./decorator/decorator";

type LinkPlugin = {
  entityType: {
    icon?: string;
    type: string;
    schemes?: Array<string>;
    attributes?: Array<string>;
    decorator?: any;
    source: any;
    onPaste?: any;
  };
};

export default () : LinkPlugin => ({
    entityType: {
      source,
      decorator,
      attributes: ["url"],
      schemes: ["http:", "https:"],
      type: ENTITY_TYPE.LINK
    }
  });
