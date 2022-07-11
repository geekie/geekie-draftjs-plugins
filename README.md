# geekie-image

DrafJS Plugin that adds image support.

## Basic usage

```tsx
import React, { ReactElement } from 'react';
import { DraftailEditor as Editor, INLINE_STYLE } from 'draftail';
import createImagePlugin, {
  registerUploadImageTask,
} from '@draft-js-plugins/image';
import 'draftail/dist/draftail.css';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

// Register how to upload the selected image
registerUploadImageTask(() =>
  Promise.resolve('https://picsum.photos/1000/700')
);

const SimpleImageEditor = (): ReactElement => (
  <div>
    <Editor
      topTool
      controls={[imagePlugin.control]}
      inlineStyles={[
        { type: INLINE_STYLE.BOLD },
        { type: INLINE_STYLE.ITALIC },
      ]}
      entityTypes={[imagePlugin.entityType]}
      plugins={plugins}
    />
  </div>
);

export default SimpleImageEditor;
```

## Setup

```bash
yarn
```

## Running in storybook

```bash
yarn storybook
```

## Publishing

Edit the packages/image/package.json by yourself.

```bash
npm run build
cd packages/image && npm publish
```
