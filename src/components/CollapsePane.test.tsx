import React from 'react';
import { CollapsePane } from './CollapsePane';
import { act } from 'react-dom/test-utils';
import { CollapsePaneProps } from './CollapsePaneProps';
import ReactDOM from 'react-dom';

describe('CollapsePane', () => {
  const onSizeChanged = jest.fn();
  const onCollapse = jest.fn();
  const onExpand = jest.fn();
  let container: HTMLDivElement;


  const defaultPaneProps: CollapsePaneProps = {
    childSizes: [1, 2],
    collapsedSize: 100,
    onSizeChanged,
    collapsed: false,
    onCollapse,
    onExpand,
    children: [<div />, <div />],
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    onSizeChanged.mockReset();
    onCollapse.mockReset();
    onExpand.mockReset();
  });

  it('has correct size in vertical not inverted mode', () => {
    act(() => {
      ReactDOM.render(<CollapsePane {...defaultPaneProps} />, container);
    });
    const collapsePanel = container.querySelector('.rrcp-main');
    const style = collapsePanel?.getAttribute('style');
    expect(style).toBe('display: grid; grid-template-columns: 1fr 2px 2fr; grid-template-rows: 100%;');
  }),
    it('has correct size in vertical not inverted collapsed mode', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const collapsePanel = container.querySelector('.rrcp-main');
      const style = collapsePanel?.getAttribute('style');
      expect(style).toBe('display: grid; grid-template-columns: 100px 2px auto; grid-template-rows: 100%;');
    }),
    it('has correct size in vertical inverted collapsed mode', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        horizontal: true,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const collapsePanel = container.querySelector('.rrcp-main');
      const style = collapsePanel?.getAttribute('style');
      expect(style).toBe('display: grid; grid-template-columns: 100%; grid-template-rows: 100px 2px auto;');
    }),
    it('has correct size in horizontal not inverted collapsed mode', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        horizontal: true,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const collapsePanel = container.querySelector('.rrcp-main');
      const style = collapsePanel?.getAttribute('style');
      expect(style).toBe('display: grid; grid-template-columns: 100%; grid-template-rows: 100px 2px auto;');
    }),
    it('has correct size in horizontal not inverted mode', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        horizontal: true,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const collapsePanel = container.querySelector('.rrcp-main');
      const style = collapsePanel?.getAttribute('style');
      expect(style).toBe('display: grid; grid-template-columns: 100%; grid-template-rows: 100px 2px auto;');
    }),
    it('has correct size in horizontal inverted collapsed mode', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        horizontal: true,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const collapsePanel = container.querySelector('.rrcp-main');
      const style = collapsePanel?.getAttribute('style');
      expect(style).toBe('display: grid; grid-template-columns: 100%; grid-template-rows: 100px 2px auto;');
    }),
    it('call callback on collapse button click', () => {
      act(() => {
        ReactDOM.render(<CollapsePane {...defaultPaneProps} />, container);
      });
      const collapseButton = container.querySelector('svg')
      expect(collapseButton).not.toBeNull();
      act(() => {
        collapseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(onCollapse).toBeCalledTimes(1);
    }),
    it('call callback on expand button click', () => {
      const props: CollapsePaneProps = {
        ...defaultPaneProps,
        collapsed: true,
      };
      act(() => {
        ReactDOM.render(<CollapsePane {...props} />, container);
      });
      const expandButton = container.querySelector('svg')
      expect(expandButton).not.toBeNull();
      act(() => {
        expandButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(onExpand).toBeCalledTimes(1);
    }),
    it('call callback on resize', () => {
      act(() => {
        ReactDOM.render(<CollapsePane {...defaultPaneProps} />, container);
      });
      const separator = container.querySelector('.rrcp-separator');
      act(() => {
        separator?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      act(() => {
        separator?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100, clientY: 100 }));
      });
      act(() => {
        separator?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });
      expect(onSizeChanged).toBeCalledTimes(1);
      expect(onSizeChanged).toBeCalledWith([100, -100]);
    });
});


