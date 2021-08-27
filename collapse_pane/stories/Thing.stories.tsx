import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CollapsePane, CollapsePaneProps } from '../src/components/CollapsePane';
import { CollapsePaneFrame, CollapsePaneFrameProps } from './CollapsePaneFrame';

const meta: Meta = {
  title: 'Welcome',
  component: CollapsePaneFrame,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<CollapsePaneFrameProps> = args => <CollapsePaneFrame {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  horisontal: false,
  inverted: false,
  snapPoints: [50, 100, 150, 200, 250],
};
