import React from 'react';
import { Story, Meta } from '@storybook/react';
import createImagePlugin, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerUploadImageTask,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  htmlToImageEntity,
} from '@geekie/geekie-image';
import { DraftailEditor, INLINE_STYLE } from 'draftail';
import createKatexPlugin, {
  registerInsertKatexCallback,
} from '../../../packages/katex/src';
import createSymbolPlugin, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerInsertSymbolCallback,
} from '../../../packages/symbol/src';
import createLinkifyPlugin from '../../../packages/linkify/src';

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
