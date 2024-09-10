import React, { useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

interface Props {
    data: any;
}

const ForceGraph2D = React.lazy(() => import('react-force-graph').then(mod => ({ default: mod.ForceGraph2D })));

export default function Graph2D({ data }: Props) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    setDimensions({ width, height });
                }
            });

            resizeObserver.observe(containerRef.current);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [])

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <ClientOnly fallback={<div>Loading...</div>}>
                {() => (
                    <React.Suspense fallback={<div>Loading graph...</div>}>
                        <ForceGraph2D
                            graphData={data}
                            width={dimensions.width}
                            height={dimensions.height}
                            nodeLabel="id"
                            nodeAutoColorBy="group"
                            linkDirectionalParticles={2}
                            linkDirectionalParticleSpeed={d => d.value * 0.001}
                        />
                    </React.Suspense>
                )}
            </ClientOnly>
        </div >
    );
};