import React, { ReactElement } from 'react';
import { DraftailEditor as Editor, INLINE_STYLE } from 'draftail';
import createSymbolPlugin, {
  registerInsertSymbolCallback,
} from '@draft-js-plugins/symbol';
import 'draftail/dist/draftail.css';

const symbolPlugin = createSymbolPlugin();
const plugins = [symbolPlugin];

registerInsertSymbolCallback((symbol) => console.log(symbol));

const SimpleImageEditor = (): ReactElement => (
  <div>
    <Editor
      topTool
      controls={[symbolPlugin.control]}
      inlineStyles={[
        { type: INLINE_STYLE.BOLD },
        { type: INLINE_STYLE.ITALIC },
      ]}
      plugins={plugins}
    />
  </div>
);

export default SimpleImageEditor;
