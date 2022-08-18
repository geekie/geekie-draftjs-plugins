import { ENTITY_TYPE } from "draftail";
import source from "./source/source";
import decorator from "./decorator/decorator";

//todo tipar
export default (config:any) => {
  return {
    entityType: {
      //icon: "#icon-link",
      //onPaste: onPaste,
      source,
      decorator,
      attributes: ["url"],
      schemes: ["http:", "https:"],
      type: ENTITY_TYPE.LINK
    }
  };
};
