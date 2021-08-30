import React, { CSSProperties, useMemo, useRef, useState } from "react";
import { CollapseButton } from "./CollapseButton";

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

    /** by defatult vertical */
    horisontal?: boolean;

    /** if horisontal inverted collapse pane will collapse left element
     *  if verticatl inverted collapse pane will collapse bottom element
     */
    inverted?: boolean;

    collapseButton?: React.ReactElement;

    expandButton?: React.ReactElement;

    onCollapse: () => void;

    onExpand: () => void;

    /**
     * offset in % from top to bottom or from left to right, 50 is center
     */
    collapseButtonOffset?: number;

    /**
     * positions in pixels left to right and top to bottom in which the delimeter will be magneted
     */
    snapPoints?: number[];

    children: [React.ReactChild, React.ReactChild]
}

interface CaptureState {
    isCaptured: boolean;
    startPosition: number;
}

/**
 * step for the delimeter move and element size
 */
const moveStep = 3;
/**
 * the interval in which the delimeter will be snapped to the snap point
 */
const snappingInterval = 20;

export function CollapsePane(props: CollapsePaneProps) {
    const columnTemplate = useMemo(() => calculateGridTemplate(props.childSizes, props.collapsedSize, props.collapsed, props.inverted),
        [props.childSizes, props.collapsedSize, props.collapsed, props.inverted]);
    const [delimeterOffset, setOffset] = useState<number>(0);
    const delimeterTranslate = useMemo(() => calculateDelimeterTranslate(delimeterOffset, moveStep, props.horisontal), [delimeterOffset]);
    const captureState = useRef<CaptureState>({ isCaptured: false, startPosition: 0 })
    const firstElement = useRef<HTMLDivElement>(null);
    const secondElement = useRef<HTMLDivElement>(null);

    const onDelimeterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!props.collapsed) {
            captureState.current.isCaptured = true;
            captureState.current.startPosition = props.horisontal ? e.clientY : e.clientX;
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current && captureState.current.isCaptured) {
            const offset = calculateOffset(props.horisontal ? e.clientY : e.clientX, captureState.current.startPosition, props.childSizes[0], props.snapPoints);
            setOffset(offset);
        }
    }

    const releaseDelimeter = (_: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current.isCaptured && firstElement.current && secondElement.current) {
            captureState.current.isCaptured = false;

            if (props.horisontal) {
                const firstElementSize = firstElement.current.clientHeight;
                const secondElementSize = secondElement.current.clientHeight;
                const delta = delimeterOffset;
                const newSizes = calculateSizes(delta, firstElementSize, secondElementSize, moveStep);
                props.onSizeChanged(newSizes);
            } else {
                const firstElementSize = firstElement.current.clientWidth;
                const secondElementSize = secondElement.current.clientWidth;
                const delta = delimeterOffset;
                const newSizes = calculateSizes(delta, firstElementSize, secondElementSize, moveStep);
                props.onSizeChanged(newSizes);
            }
            setOffset(0);
        }
    }

    return <div
        style={getContainerStyle(props.horisontal, columnTemplate)}
        onMouseLeave={releaseDelimeter}
        onMouseUp={releaseDelimeter}
        onMouseMove={e => onMouseMove(e)}>
        <div style={getFirstElementStyle(props.horisontal)} ref={firstElement}>{props.children[0]}</div>
        <div style={getSecondElementStyle(props.horisontal)} ref={secondElement}>{props.children[1]}</div>
        <div style={getDelimeterStyle(props.horisontal, props.collapsed)} onMouseDown={onDelimeterMouseDown}>
            <span style={getCollapseButtonOffsetStyle(props.horisontal, props.collapseButtonOffset)} />
            <CollapseButton
                collapsed={props.collapsed}
                inverted={!!props.inverted}
                horisontal={!!props.horisontal}
                customCollapseButton={props.collapseButton}
                customExpandButton={props.expandButton}
                onCollapse={props.onCollapse}
                onExpand={props.onExpand}
            />
            <div style={getMovingDelimeterStyle(delimeterTranslate, captureState.current.isCaptured)} />
        </div>
    </div>;
}

function getContainerStyle(horisontal: boolean | undefined, gridTemplate: string) {
    if (horisontal) {
        return {
            display: 'grid',
            gridTemplateColumns: '100%',
            gridTemplateRows: gridTemplate,
        };
    }
    return {
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gridTemplateRows: '100%',
    };
}

function getFirstElementStyle(horisontal: boolean | undefined) {
    if (horisontal) {
        return { gridRow: 1 };
    }
    return { gridColumn: 1 };
}

function getSecondElementStyle(horisontal: boolean | undefined) {
    if (horisontal) {
        return { gridRow: 3 };
    }
    return { gridColumn: 3 };
}

function getDelimeterStyle(horisontal: boolean | undefined, collapsed: boolean): CSSProperties {
    if (horisontal) {
        return {
            gridColumn: 1,
            gridRow: 2,
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            cursor: collapsed ? 'inherit' : 'row-resize',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            position: 'relative',
        };
    }
    return {
        gridColumn: 2,
        gridRow: 1,
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        cursor: collapsed ? 'inherit' : 'col-resize',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        position: 'relative',
    };
}

function getCollapseButtonOffsetStyle(horisontal: boolean | undefined, offset: number | undefined) {
    if (horisontal) {
        return { width: `${offset ?? 50}%` };
    }
    return { height: `${offset ?? 50}%` };
}

function getMovingDelimeterStyle(delimeterTranslate: string, isCaptured: boolean): CSSProperties {
    return {
        position: 'absolute',
        transform: delimeterTranslate,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: isCaptured ? 'block' : 'none',
        backgroundColor: 'gray',
    };
}

function calculateGridTemplate(sizes: [number, number], collapsedSize: number, collapsed: boolean, inverted?: boolean): string {
    if (collapsed) {
        if (inverted) {
            return `auto 2px ${collapsedSize}px`;
        }
        return `${collapsedSize}px 2px auto`;
    }

    return `${sizes[0]}fr 2px ${sizes[1]}fr`;
}

function calculateSizes(
    delta: number,
    firstElementSize: number,
    secondElementSize: number,
    step: number): [number, number] {
    let firstRoundedSize = step * (((firstElementSize + delta) / step) | 0);
    let secondRoundedSize = step * (((secondElementSize - delta) / step) | 0);
    return [firstRoundedSize, secondRoundedSize];
}

function calculateDelimeterTranslate(delimeterOffset: number, step: number, isVertical?: boolean): any {
    const offset = step * ((delimeterOffset / step) | 0);
    if (isVertical) {
        return `translateY(${offset}px)`
    }
    return `translateX(${offset}px)`;
}

function calculateOffset(curPosition: number, startPosition: number, referencePoint: number, snapPoints: number[] | undefined): number {
    const shift = curPosition - startPosition;
    if (snapPoints && snapPoints.length) {
        const curOffset = referencePoint + shift;
        const snapPointIndex = snapPoints.findIndex(x => Math.abs(x - curOffset) < snappingInterval);
        if (snapPointIndex >= 0) {
            return snapPoints[snapPointIndex] - startPosition;
        }
    }
    return shift;
}
