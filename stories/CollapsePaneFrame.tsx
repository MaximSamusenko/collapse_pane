import 'react';
import { useState } from 'react';
import { CollapsePane } from '../src/components/CollapsePane';

export interface CollapsePaneFrameProps {
    horizontal: boolean,
    inverted: boolean,
    snapPoints?: number[],
    separatorWidth?: number,
}

export function CollapsePaneFrame({ horizontal, inverted, snapPoints, separatorWidth }: CollapsePaneFrameProps) {
    const [sizes, setSizes] = useState<[number, number]>([1, 2]);
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = () => {
        setCollapsed(true);
    };

    const onExpand = () => {
        setCollapsed(false);
    };

    const onSizeChanged = (sizes: [number, number]) => {
        setSizes(sizes);
    }

    return (<div style={{ width: '400px', height: '400px', display: 'grid', border: "1px solid black" }}>
        <CollapsePane
            childSizes={sizes}
            collapsedSize={100}
            onSizeChanged={(sizes) => onSizeChanged(sizes)}
            collapsed={collapsed}
            collapseButtonOffset={70}
            onCollapse={() => onCollapse()}
            onExpand={() => onExpand()}
            inverted={inverted}
            horizontal={horizontal}
            snapPoints={snapPoints}
            separatorWidth={separatorWidth}
        >
            <div style={{
                width: '100%',
                height: '100%'
            }}></div>
            <div style={{
                width: '100%',
                height: '100%',
            }}></div>
        </CollapsePane >
    </div >);
}