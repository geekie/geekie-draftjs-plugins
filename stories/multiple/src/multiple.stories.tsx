import { Meta, Story } from '@storybook/react';
import { DraftailEditor, INLINE_STYLE } from 'draftail';
import React from 'react';

import createImagePlugin from '../../../packages/image/src';
import createKatexPlugin, {
  registerInsertKatexCallback,
} from '../../../packages/katex/src';
import createLinkifyPlugin from '../../../packages/linkify/src';
import createSymbolPlugin from '../../../packages/symbol/src';

export default {
  title: 'Multiple Editors',
  component: DraftailEditor,
} as Meta;

const tip = (
  <div>
    <p style={{ margin: 0 }}>
      <b style={{ color: 'orange' }}>Dica:</b> Esse plugin aceita um componente
      externo de informações
    </p>
  </div>
);

const katexPlugin = createKatexPlugin({ infoComponent: tip });
const symbolPlugin = createSymbolPlugin();
const linkifyPlugin = createLinkifyPlugin();
const imagePlugin = createImagePlugin();

const plugins = [katexPlugin, symbolPlugin, linkifyPlugin, imagePlugin];
const entities = [
  katexPlugin.entityType,
  linkifyPlugin.entityType,
  imagePlugin.entityType,
];
const controls = [
  katexPlugin.control,
  symbolPlugin.control,
  imagePlugin.control,
];
const inlineStyles = [
  {
    type: INLINE_STYLE.BOLD,
  },
  {
    type: INLINE_STYLE.ITALIC,
  },
  {
    type: INLINE_STYLE.UNDERLINE,
  },
  {
    type: INLINE_STYLE.STRIKETHROUGH,
  },
  {
    type: INLINE_STYLE.SUPERSCRIPT,
  },
  {
    type: INLINE_STYLE.SUBSCRIPT,
  },
];
registerInsertKatexCallback(() => {
  // eslint-disable-next-line no-console
  console.log('new katex added');
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Editor = () => (
  <DraftailEditor
    entityTypes={entities}
    controls={controls}
    plugins={plugins}
    inlineStyles={inlineStyles}
  />
);

export const Default: Story = () => (
  <div>
    <Editor />
    <br />
    <Editor />
    <br />
    <Editor />
    <br />
    <Editor />
    <br />
  </div>
);
