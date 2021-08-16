import React, { MutableRefObject, useMemo, useRef } from "react";

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

interface CaptureState {
    isCaptured: boolean;
    startPosition: number;
}

export function CollapsePane(props: CollapsePaneProps) {
    /**
     * step for the delimeter move and element size
     */
    const moveStep = 3;
    const columnTemplate = useMemo(() => calculateColumnTemplate(props.childSizes, props.collapsedSize), [props.childSizes]);
    const captureState = useRef<CaptureState>({ isCaptured: false, startPosition: 0 })
    const firstElement = useRef<HTMLDivElement>(null);
    const secondElement = useRef<HTMLDivElement>(null);

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

    const onDelimeterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        captureState.current.isCaptured = true;
        captureState.current.startPosition = e.clientX;
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current.isCaptured) {
            // translate the delimeter here
        }
    }

    const releaseDelimeter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current.isCaptured && firstElement.current && secondElement.current) {
            captureState.current.isCaptured = false;
            const firstElementSize = firstElement.current.clientWidth;
            const secondElementSize = secondElement.current.clientWidth;
            const delta = e.clientX - captureState.current.startPosition;
            const newSizes = calculateSizes(props.isVertical, props.isInverted, delta, firstElementSize, secondElementSize, moveStep);
            props.onSizeChanged(newSizes);
        }
    }

    return <div style={containerStyle} onMouseLeave={releaseDelimeter} onMouseUp={releaseDelimeter} onMouseMove={e => onMouseMove(e)}>
        <div style={firstElementStyle} ref={firstElement}>{props.children[0]}</div>
        <div style={secondElementStyle} ref={secondElement}>{props.children[1]}</div>
        <div style={delimeterStyle} onMouseDown={onDelimeterMouseDown}></div>
    </div>;
}

function calculateColumnTemplate(sizes: [number, number], collapsedSize: number): string {
    return `minmax(${collapsedSize}px, ${sizes[0]}fr) 5px ${sizes[1]}fr`;;
}

function calculateSizes(
    isVertical: boolean | undefined,
    isInverted: boolean | undefined,
    delta: number,
    firstElementSize: number,
    secondElementSize: number,
    step: number): [number, number] {
    // use greatest common devisor here
    throw new Error("Function not implemented.");
}
