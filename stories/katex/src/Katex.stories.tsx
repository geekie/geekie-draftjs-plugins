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

const katexPlugin = createKatexPlugin({
  rules: [
    { minWidth: 100, tipText: 'Dica: green', tipColor: 'green' },
    { minWidth: 150, tipText: 'Dica: blue', tipColor: 'blue' },
    { minWidth: 200, disableButton: true },
  ],
});

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
