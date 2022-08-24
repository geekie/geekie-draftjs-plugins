# geekie-linkify

## Basic usage

```
import React from "react";
import { DraftailEditor } from "draftail";
import createLinkifyPlugin from "@geekie/geekie-linkify";


const linkifyPlugin = createLinkifyPlugin();

export default = () => (
  <DraftailEditor
    entityTypes={[linkifyPlugin.entityType]}
    plugins={[linkifyPlugin]} 
  />
);

```
