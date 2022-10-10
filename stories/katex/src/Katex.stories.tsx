import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DraftailEditor } from 'draftail';
import createKatexPlugin, {
  registerInsertKatexCallback,
  registerMathInputWidthCallback,
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

registerMathInputWidthCallback((width) => {
  // eslint-disable-next-line no-console
  console.log('math input width:', width);
});

export const Default: Story = () => (
  <DraftailEditor
    entityTypes={[katexPlugin.entityType]}
    controls={[katexPlugin.control]}
    plugins={[katexPlugin]}
  />
);

export const TwoInstances: Story = () => (
  <>
    <div style={{ marginBottom: 50 }}>
      <DraftailEditor
        entityTypes={[katexPlugin.entityType]}
        controls={[katexPlugin.control]}
        plugins={[katexPlugin]}
      />
    </div>
    <DraftailEditor
      entityTypes={[katexPlugin.entityType]}
      controls={[katexPlugin.control]}
      plugins={[katexPlugin]}
    />
  </>
);
