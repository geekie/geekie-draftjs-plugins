# geekie-katex

## Basic usage

```
import React from "react";
import { DraftailEditor } from "draftail";
import createKatexPlugin from "@geekie/geekie-katex";

const katexPlugin = createKatexPlugin();

export default = () => (
  <DraftailEditor
    entityTypes={[katexPlugin.entityType]}
    controls={[katexPlugin.control]}
    plugins={[katexPlugin]} 
  />
);

```
