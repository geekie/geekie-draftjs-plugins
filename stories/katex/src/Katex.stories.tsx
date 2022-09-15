import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DraftailEditor } from 'draftail';
import createKatexPlugin, {
  registerInsertKatexCallback,
} from '../../../packages/katex/src';

export default {
  title: 'Katex/Katex plugin',
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

registerInsertKatexCallback(() => {
  // eslint-disable-next-line no-console
  console.log('new katex added');
});

export const Default: Story = () => (
  <DraftailEditor
    entityTypes={[katexPlugin.entityType]}
    controls={[katexPlugin.control]}
    plugins={[katexPlugin]}
  />
);
