import React, { useMemo, useRef, useState } from "react";
import { CollapseButton } from "./CollapseButton";
import { calculateGridTemplate, calculateOffset, calculateSeparatorTranslate, calculateSizes, getCollapseButtonOffsetStyle, getContainerStyle, getFirstElementStyle, getMovingSeparatorStyle, getSecondElementStyle, getSeparatorStyle, paneIsSmallerThanCollapsedSize } from "./CollapsePaneHelper";
import { CaptureState, CollapsePaneProps } from "./CollapsePaneProps";

export function CollapsePane(props: CollapsePaneProps) {
    const columnTemplate = useMemo(() => calculateGridTemplate(props.childSizes, props.collapsedSize, props.collapsed, props.inverted, props.separatorWidth),
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

    return <div className="rrcp-main"
        style={getContainerStyle(props.horizontal, columnTemplate)}
        onMouseLeave={releaseDelimiter}
        onMouseUp={releaseDelimiter}
        onMouseMove={e => onMouseMove(e)}>
        <div className="rrcp-first-container" style={getFirstElementStyle(props.horizontal)} ref={firstElement}>{props.children[0]}</div>
        <div className="rrcp-second-container" style={getSecondElementStyle(props.horizontal)} ref={secondElement}>{props.children[1]}</div>
        <div className="rrcp-separator" style={getSeparatorStyle(props.horizontal, props.collapsed, props.separatorColor)} onMouseDown={onDelimiterMouseDown}>
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
            <div className="rrcp-moving-separator" style={getMovingSeparatorStyle(delimiterTranslate, captureState.current.isCaptured, props.movingSeparatorColor)} />
        </div>
    </div>;
}

