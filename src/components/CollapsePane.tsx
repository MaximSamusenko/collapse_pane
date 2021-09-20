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

    // color of the separator line
    separatorColor?: string;

    // color of the moving separator line
    movingSeparatorColor?: string;

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

interface CaptureState {
    isCaptured: boolean;
    startPosition: number;
}

/**
 * the interval in which the delimiter will be snapped to the snap point
 */
const snappingInterval = 20;

export function CollapsePane(props: CollapsePaneProps) {
    const columnTemplate = useMemo(() => calculateGridTemplate(props.childSizes, props.collapsedSize, props.collapsed, props.inverted),
        [props.childSizes, props.collapsedSize, props.collapsed, props.inverted]);
    const [delimiterOffset, setOffset] = useState<number>(0);
    const delimiterTranslate = useMemo(() => calculateSeparatorTranslate(delimiterOffset, props.horizontal), [delimiterOffset]);
    const captureState = useRef<CaptureState>({ isCaptured: false, startPosition: 0 })
    const firstElement = useRef<HTMLDivElement>(null);
    const secondElement = useRef<HTMLDivElement>(null);

    const onDelimiterMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!props.collapsed) {
            captureState.current.isCaptured = true;
            captureState.current.startPosition = props.horizontal ? e.clientY : e.clientX;
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current && captureState.current.isCaptured) {
            const offset = calculateOffset(props.horizontal ? e.clientY : e.clientX, captureState.current.startPosition, props.childSizes[0], props.snapPoints);
            setOffset(offset);
        }
    }

    const releaseDelimiter = (_: React.MouseEvent<HTMLDivElement>) => {
        if (captureState.current.isCaptured && firstElement.current && secondElement.current) {
            captureState.current.isCaptured = false;

            const firstElementSize = props.horizontal ? firstElement.current.clientHeight : firstElement.current.clientWidth;
            const secondElementSize = props.horizontal ? secondElement.current.clientHeight : secondElement.current.clientWidth;
            const delta = delimiterOffset;
            const newSizes = calculateSizes(delta, firstElementSize, secondElementSize);
            if (paneIsSmallerThanCollapsedSize(newSizes, props.inverted, props.collapsedSize)) {
                props.onCollapse();
            } else {
                props.onSizeChanged(newSizes);
                setOffset(0);
            }
        }
    }

    return <div
        style={getContainerStyle(props.horizontal, columnTemplate)}
        onMouseLeave={releaseDelimiter}
        onMouseUp={releaseDelimiter}
        onMouseMove={e => onMouseMove(e)}>
        <div style={getFirstElementStyle(props.horizontal)} ref={firstElement}>{props.children[0]}</div>
        <div style={getSecondElementStyle(props.horizontal)} ref={secondElement}>{props.children[1]}</div>
        <div style={getSeparatorStyle(props.horizontal, props.collapsed, props.separatorColor)} onMouseDown={onDelimiterMouseDown}>
            <span style={getCollapseButtonOffsetStyle(props.horizontal, props.collapseButtonOffset)} />
            <CollapseButton
                collapsed={props.collapsed}
                inverted={!!props.inverted}
                horizontal={!!props.horizontal}
                customCollapseButton={props.collapseButton}
                customExpandButton={props.expandButton}
                onCollapse={props.onCollapse}
                onExpand={props.onExpand}
            />
            <div style={getMovingSeparatorStyle(delimiterTranslate, captureState.current.isCaptured, props.movingSeparatorColor)} />
        </div>
    </div>;
}

function getContainerStyle(horizontal: boolean | undefined, gridTemplate: string) {
    if (horizontal) {
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

function getFirstElementStyle(horizontal: boolean | undefined) {
    if (horizontal) {
        return { display: 'grid', gridRow: 1 };
    }
    return { display: 'grid', gridColumn: 1 };
}

function getSecondElementStyle(horizontal: boolean | undefined) {
    if (horizontal) {
        return { display: 'grid', gridRow: 3 };
    }
    return { display: 'grid', gridColumn: 3 };
}

function getSeparatorStyle(horizontal: boolean | undefined, collapsed: boolean, separatorColor: string | undefined): CSSProperties {
    if (horizontal) {
        return {
            gridColumn: 1,
            gridRow: 2,
            backgroundColor: separatorColor ?? 'black',
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
        backgroundColor: separatorColor ?? 'black',
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

function getCollapseButtonOffsetStyle(horizontal: boolean | undefined, offset: number | undefined) {
    if (horizontal) {
        return { width: `${offset ?? 50}%` };
    }
    return { height: `${offset ?? 50}%` };
}

function getMovingSeparatorStyle(separatorTranslate: string, isCaptured: boolean, separatorColor: string | undefined): CSSProperties {
    return {
        position: 'absolute',
        transform: separatorTranslate,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: isCaptured ? 'block' : 'none',
        backgroundColor: separatorColor ?? 'gray',
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
    secondElementSize: number): [number, number] {
    let firstRoundedSize = firstElementSize + delta;
    let secondRoundedSize = secondElementSize - delta;
    return [firstRoundedSize, secondRoundedSize];
}

function calculateSeparatorTranslate(delimiterOffset: number, isVertical?: boolean): any {
    if (isVertical) {
        return `translateY(${delimiterOffset}px)`
    }
    return `translateX(${delimiterOffset}px)`;
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

function paneIsSmallerThanCollapsedSize(sizes: [number, number], inverted: boolean | undefined, collapsedSize: number): boolean {
    return inverted ? sizes[1] < collapsedSize : sizes[0] < collapsedSize;
}

