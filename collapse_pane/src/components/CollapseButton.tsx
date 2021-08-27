import React from "react";

export interface CollapseButtonProps {
    horisontal: boolean,
    inverted: boolean,
    collapsed: boolean,
    onCollapse: () => void,
    onExpand: () => void,
    customCollapseButton?: React.ReactElement,
    customExpandButton?: React.ReactElement,
}


export function CollapseButton({ horisontal, inverted, collapsed, customCollapseButton, customExpandButton, onCollapse, onExpand }: CollapseButtonProps) {
    if (collapsed) {
        if (customExpandButton) {
            return <span onClick={_ => onExpand()} style={{ cursor: "pointer" }}>{customExpandButton}</span>;
        }
        if (horisontal) {
            if (inverted) {
                return <UpButton onClick={() => onExpand()} />
            } else {
                return <DownButton onClick={() => onExpand()} />
            }
        } else {
            if (inverted) {
                return <LeftButton onClick={() => onExpand()} />
            } else {
                return <RightButton onClick={() => onExpand()} />
            }
        }
    } else {
        if (customCollapseButton) {
            return <span onClick={_ => onCollapse()} style={{ cursor: "pointer" }}>{customCollapseButton}</span>;
        }
        if (horisontal) {
            if (inverted) {
                return <DownButton onClick={() => onCollapse()} />
            } else {
                return <UpButton onClick={() => onCollapse()} />
            }
        } else {
            if (inverted) {
                return <RightButton onClick={() => onCollapse()} />
            } else {
                return <LeftButton onClick={() => onCollapse()} />
            }
        }
    }
}

function SvgArrowButton({ arrowPoints, onClick }: { arrowPoints: string, onClick: () => void }) {
    return <svg version="1.1"
        baseProfile="full"
        width="20" height="20"
        xmlns="http://www.w3.org/2000/svg"
        onClick={_ => onClick()} style={{ cursor: "pointer" }}>
        <circle r="10" cx="10" cy="10" fill="black" />
        <polygon points={arrowPoints} fill="white" />
    </svg >;
}

function UpButton({ onClick }: { onClick: () => void }) {
    return <SvgArrowButton arrowPoints="5,13 10,5 15,13" onClick={onClick} />;
}
function DownButton({ onClick }: { onClick: () => void }) {
    return <SvgArrowButton arrowPoints="5,7 10,15 15,7" onClick={onClick} />;
}
function RightButton({ onClick }: { onClick: () => void }) {
    return <SvgArrowButton arrowPoints="7,5 15,10 7,15" onClick={onClick} />;
}
function LeftButton({ onClick }: { onClick: () => void }) {
    return <SvgArrowButton arrowPoints="13,5 5,10 13,15" onClick={onClick} />;
}