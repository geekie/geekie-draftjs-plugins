import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DraftailEditor } from "draftail";
import createLinkifyPlugin from "../../../packages/linkify/src";

export default {
  title: 'Links/Linkify plugin',
  component: DraftailEditor,
} as Meta;

const linkifyPlugin = createLinkifyPlugin();

export const Default: Story = () => (
  <DraftailEditor
    entityTypes={[linkifyPlugin.entityType]}
    plugins={[linkifyPlugin]} 
  />
);
