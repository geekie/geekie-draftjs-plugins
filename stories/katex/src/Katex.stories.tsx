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
    {
      minWidth: 100,
      tipHtml: (
        <div>
          <p style={{ margin: 0 }}>
            <b style={{ color: 'orange' }}>Dica:</b> Esse plugin aceita um
            componente externo de informações
          </p>
        </div>
      ),
      tipText: 'este texto será ignorado',
      tipColor: 'green',
      borderColor: 'green',
    },
    {
      minWidth: 150,
      tipText: 'Dica: blue',
      tipColor: 'blue',
      borderColor: 'blue',
    },
    { minWidth: 200, disableButton: true, borderColor: 'red' },
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
