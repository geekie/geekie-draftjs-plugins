import { ENTITY_TYPE } from "draftail";
import source, {SourceProps} from "./source/source";
import decorator, {DecoratorProps} from "./decorator/decorator";
import LinkIcon from "./linkIcon";

type LinkPlugin = {
  entityType: {
    icon?: JSX.Element;
    type: string;
    schemes?: Array<string>;
    attributes?: Array<string>;
    decorator?: (props:DecoratorProps) => JSX.Element;
    source: (props:SourceProps) => JSX.Element;
    onPaste?: any;
  };
};

export default () : LinkPlugin => ({
    entityType: {
      icon: LinkIcon,
      source,
      decorator,
      attributes: ["url"],
      schemes: ["http:", "https:"],
      type: ENTITY_TYPE.LINK
    }
  });
