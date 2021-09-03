# redux-react-collapse-pane User Guide

## [[demo]](https://codesandbox.io/s/redux-react-collapse-pane-demo-7gnk4)

# Getting Started :rocket:

Install redux-react-collapse-pane:
```bash
npm i redux-react-collapse-pane

# or for yarn

yarn add redux-react-collapse-pane
```
Once installed you can import the `CollapsePane` component in your code.

```ts
import { CollapsePane } from "redux-react-collapse-pane";
```
# Quick Start Usage

To resize your components you need to wrap it out with CollapsePane frame. 
The idea of this implementation of pane is to control the collapsing and resizing from the parent component.
This will enable you to persist collapse pane in redux and update the pane from redux state.

The required props are:
- childSizes - [number, number] is a proportional sizes of the splitting elements
- collapsedSize - number is a size to which you element will be collapsed
- onSizeChanged - ([number, number]) => void is a callback which will be called once the element sizes changed
- collapsed - boolean is a flag which determines if the element is collapsed
- onCollapse - () => void is a callback which will be called once the collapse button will be called
- onExpand - () => void is a callback which will be called once the expand button will be called

```tsx
    <CollapsePane
      childSizes={sizes}
      collapsedSize={100}
      onSizeChanged={(sizes: [number, number]) => onSizeChanged(sizes)}
      collapsed={collapsed}
      onCollapse={() => onCollapse()}
      onExpand={() => onExpand()}
    >
  <div>First</div>
  <div>Second</div>
</CollapsePane>
```
This will be vertical panel, it's left element will be collapsible.

# All available options

```tsx
  export interface CollapsePaneProps {
      collapsed: boolean,

      /**
       * this sizes are relative
       * ex: [1,2] second element is two times bigger than the first
       */
      childSizes: [number, number];

      /** this size is absolute, and is using for collapsed element */
      collapsedSize: number;

      onSizeChanged: (sizes: [number, number]) => void;

      /** by default vertical */
      horizontal?: boolean;

      /** if horizontal inverted collapse pane will collapse left element
       *  if vertical inverted collapse pane will collapse bottom element
       */
      inverted?: boolean;

      // you can use custom collapse button
      collapseButton?: React.ReactElement;

      // you can use custom expand button
      expandButton?: React.ReactElement;

      onCollapse: () => void;

      onExpand: () => void;

      /**
       * offset in % from top to bottom or from left to right, 50 is center
       */
      collapseButtonOffset?: number;

      /**
       * positions in pixels left to right and top to bottom in which the delimiter will be snapped
       */
      snapPoints?: number[];

      children: [React.ReactChild, React.ReactChild]
  }
```