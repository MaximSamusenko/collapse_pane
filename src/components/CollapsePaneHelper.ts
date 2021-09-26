import { CSSProperties } from "react";

/**
 * the interval in which the delimiter will be snapped to the snap point
 */
const snappingInterval = 20;

export function getContainerStyle(horizontal: boolean | undefined, gridTemplate: string) {
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

export function getFirstElementStyle(horizontal: boolean | undefined) {
    if (horizontal) {
        return { display: 'grid', gridRow: 1 };
    }
    return { display: 'grid', gridColumn: 1 };
}

export function getSecondElementStyle(horizontal: boolean | undefined) {
    if (horizontal) {
        return { display: 'grid', gridRow: 3 };
    }
    return { display: 'grid', gridColumn: 3 };
}

export function getSeparatorStyle(horizontal: boolean | undefined, collapsed: boolean, separatorColor: string | undefined): CSSProperties {
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

export function getCollapseButtonOffsetStyle(horizontal: boolean | undefined, offset: number | undefined) {
    if (horizontal) {
        return { width: `${offset ?? 50}%` };
    }
    return { height: `${offset ?? 50}%` };
}

export function getMovingSeparatorStyle(separatorTranslate: string, isCaptured: boolean, separatorColor: string | undefined): CSSProperties {
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

export function calculateGridTemplate(sizes: [number, number], collapsedSize: number, collapsed: boolean, inverted?: boolean, separatorWidth?: number): string {
    if (collapsed) {
        if (inverted) {
            return `auto ${separatorWidth ?? 2}px ${collapsedSize}px`;
        }
        return `${collapsedSize}px ${separatorWidth ?? 2}px auto`;
    }

    return `${sizes[0]}fr ${separatorWidth ?? 2}px ${sizes[1]}fr`;
}

export function calculateSizes(
    delta: number,
    firstElementSize: number,
    secondElementSize: number): [number, number] {
    let firstRoundedSize = firstElementSize + delta;
    let secondRoundedSize = secondElementSize - delta;
    return [firstRoundedSize, secondRoundedSize];
}

export function calculateSeparatorTranslate(delimiterOffset: number, isVertical?: boolean): any {
    if (isVertical) {
        return `translateY(${delimiterOffset}px)`
    }
    return `translateX(${delimiterOffset}px)`;
}

export function calculateOffset(curPosition: number, startPosition: number, referencePoint: number, snapPoints: number[] | undefined): number {
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

export function paneIsSmallerThanCollapsedSize(sizes: [number, number], inverted: boolean | undefined, collapsedSize: number): boolean {
    return inverted ? sizes[1] < collapsedSize : sizes[0] < collapsedSize;
}