import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CollapsePane, CollapsePaneProps } from '../src/components/CollapsePane';

const meta: Meta = {
  title: 'Welcome',
  component: CollapsePane,
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

const props: Partial<CollapsePaneProps> = {
  collapsed: false,
  childSizes: [1, 2],
  collapsedSize: 100,
  collapseButton: <button>collapse</button>,
  expandButton: <button>expand</button>,
  onSizeChanged: (sizes) => { console.log('size changed', sizes) },
  onCollapseButtonClicked: () => { console.log('collapse button clicked') },
}

const Template: Story<CollapsePaneProps> = args => (<div style={{ width: '100%', height: '400px' }}><CollapsePane {...args}>
  <div style={{
    width: '100%',
    height: '100%', backgroundColor: 'green'
  }}></div>
  <div style={{
    width: '100%',
    height: '100%', backgroundColor: 'blue'
  }}></div>
</CollapsePane></div>);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = props;
