import React from 'react';
import { Story, Meta } from '@storybook/react';

import SimpleImageEditor from './SimpleImageEditor';

export default {
  title: 'Image/Image plugin',
  component: SimpleImageEditor,
} as Meta;

export const Default: Story = () => <SimpleImageEditor />;
