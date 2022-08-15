import React from 'react';
import { Story, Meta } from '@storybook/react';

import SymbolEditor from './SymbolEditor';

export default {
  title: 'Symbol/Editor with Symbol Plugin',
  component: SymbolEditor,
} as Meta;

export const Default: Story = () => <SymbolEditor />;
