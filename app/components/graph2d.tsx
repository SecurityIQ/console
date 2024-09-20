import React, { useEffect, useRef, useState } from "react";
import { GraphData } from "react-force-graph-2d";
import { ClientOnly } from "remix-utils/client-only";
import { css } from "styled-system/css";

interface Props {
  data: GraphData;
}

const ForceGraph2D = React.lazy(() =>
  import("react-force-graph").then((mod) => ({ default: mod.ForceGraph2D }))
);

export default function Graph2D({ data }: Props) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={css({
        width: "100%",
        height: "100%",
        color: "black",
      })}
    >
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
              linkDirectionalParticleSpeed={(d) => d.value * 0.001}
            />
          </React.Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
