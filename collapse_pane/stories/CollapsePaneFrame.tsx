import 'react';
import { useState } from 'react';
import { CollapsePane } from '../src/components/CollapsePane';

export function CollapsePaneFrame() {
    const [sizes, setSizes] = useState<[number, number]>([1, 2]);
    const [collapsed, setCollapsed] = useState(false);
    
    return (<div style={{ width: '100%', height: '400px' }}>
        <CollapsePane childSizes={sizes}
            collapsedSize={100}
            collapseButton={<button onClick={() => setCollapsed(true)}>collapse</button>}
            expandButton={<button onClick={() => setCollapsed(false)}>expand</button>}
            onSizeChanged={(sizes) => { setSizes(sizes) }}            
            collapsed={collapsed}
            collapseButtonOffset={50}>
            <div style={{
                width: '100%',
                height: '100%', backgroundColor: 'green'
            }}></div>
            <div style={{
                width: '100%',
                height: '100%', backgroundColor: 'blue'
            }}></div>
        </CollapsePane >
    </div >);
}