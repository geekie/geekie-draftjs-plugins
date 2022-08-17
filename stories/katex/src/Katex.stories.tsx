import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DraftailEditor } from "draftail";
import createKatexPlugin from "../../../packages/katex/src";

export default {
  title: 'Katex/Katex plugin',
  component: DraftailEditor,
} as Meta;

const katexPlugin = createKatexPlugin();

export const Default: Story = () => (
  <DraftailEditor
    entityTypes={[katexPlugin.entityType]}
    controls={[katexPlugin.control]}
    plugins={[katexPlugin]} 
  />
);
