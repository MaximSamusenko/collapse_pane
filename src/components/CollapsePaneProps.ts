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

    // width of the separator line
    separatorWidth?: number;

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

export interface CaptureState {
    isCaptured: boolean;
    startPosition: number;
}