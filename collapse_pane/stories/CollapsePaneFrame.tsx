import 'react';
import { useState } from 'react';
import { CollapsePane } from '../src/components/CollapsePane';

export interface CollapsePaneFrameProps {
    horisontal: boolean,
    inverted: boolean,
    snapPoints?: number[]
}

export function CollapsePaneFrame({ horisontal, inverted, snapPoints }: CollapsePaneFrameProps) {
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
            // collapseButton={<button >&lt;&lt;</button>}
            // expandButton={<button >&gt;&gt;</button>}
            onSizeChanged={(sizes) => onSizeChanged(sizes)}
            collapsed={collapsed}
            collapseButtonOffset={70}
            onCollapse={() => onCollapse()}
            onExpand={() => onExpand()}
            inverted={inverted}
            horisontal={horisontal}      
            snapPoints={snapPoints}      
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