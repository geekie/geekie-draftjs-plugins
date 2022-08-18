import { ENTITY_TYPE } from "draftail";
import source from "./source/source";
import decorator from "./decorator/decorator";

export default (config) => {
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
