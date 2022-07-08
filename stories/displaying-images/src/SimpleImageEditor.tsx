import React, { ReactElement } from 'react';
import { DraftailEditor as Editor, INLINE_STYLE } from 'draftail';
import createImagePlugin from '@draft-js-plugins/image';
import 'draftail/dist/draftail.css';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

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
