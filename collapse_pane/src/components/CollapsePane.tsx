import React, { useMemo } from "react";

export interface CollapsePaneProps {
    collapsed: boolean,
    /**
     * this sizes are relative
     * ex: [1,2] second element is two times bigger then the first
     */
    childSizes: [number, number];
    /** this size is absolute, and is using for collapsed element */
    collapsedSize: number;

    onSizeChanged: (sizes: [number, number]) => void;

    onCollapseButtonClicked: () => void;

    /** by defatult horisontal */
    isVertical?: boolean;

    /** if horisontal inverted collapse pane will collapse left elemen
     *  if verticatl inverted collapse pane will collapse bottom element
     */
    isInverted?: boolean;

    collapseButton: React.ReactElement;

    /**
     * offset in % from top to bottom or from left to right, 50 is center
     */
    collapseButtonOffset: number;

    expandButton: React.ReactElement;

    children: [React.ReactChild, React.ReactChild]
}

export function CollapsePane(props: CollapsePaneProps) {
    const columnTemplate = useMemo(() => calculateColumnTemplate(props.childSizes, props.collapsedSize), [props.childSizes]);

    const containerStyle = {
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: columnTemplate,
        gridTemplateRows: '100%',
    };

    const firstElementStyle = {
        gridColumn: 1
    };
    const secondElementStyle = {
        gridColumn: 3
    };
    const delimeterStyle = {
        gridColumn: 2,
        gridRow: 1,
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        cursor: 'col-resize',
    };

    return <div style={containerStyle}>
        <div style={firstElementStyle}>{props.children[0]}</div>
        <div style={secondElementStyle}>{props.children[1]}</div>
        <div style={delimeterStyle} onMouseDown></div>
    </div>;
}

function calculateColumnTemplate(sizes: [number, number], collapsedSize: number): string {
    return `minmax(${collapsedSize}px, ${sizes[0]}fr) 5px ${sizes[1]}fr`;;
}