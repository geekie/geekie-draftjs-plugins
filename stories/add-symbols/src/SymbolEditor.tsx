import React, { ReactElement } from 'react';
import { DraftailEditor as Editor, INLINE_STYLE } from 'draftail';
import 'draftail/dist/draftail.css';
import createSymbolPlugin, {
  registerInsertSymbolCallback,
} from '../../../packages/symbol/src';

const symbolPlugin = createSymbolPlugin();
const plugins = [symbolPlugin];

registerInsertSymbolCallback((symbol) => {
  // eslint-disable-next-line no-console
  console.log(symbol);
});

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
