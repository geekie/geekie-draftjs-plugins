# geekie-katex

## Dependencies

- katex 0.16.0
- jquery 1.11.0
- mathquill 0.10.1

## Client imports

```
<link href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css" rel="stylesheet">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js"></script>
```

## Basic usage

```
import React from "react";
import { DraftailEditor } from "draftail";
import createKatexPlugin from "@geekie/geekie-katex";

import "katex/dist/katex.min.css";

const katexPlugin = createKatexPlugin();

export default = () => (
  <DraftailEditor
    entityTypes={[katexPlugin.entityType]}
    controls={[katexPlugin.control]}
    plugins={[katexPlugin]} 
  />
);

```
