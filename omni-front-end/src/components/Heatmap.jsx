import React, { useRef, useEffect } from 'react';

export const Heatmap = ({ data, width = 300, height = 300 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length !== 1024) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const cellW = width / 32;
    const cellH = height / 32;

    // Helper to get color from value (0 to 1) - Blue to Red colormap
    const getColor = (value) => {
      // 0 = dark blue, 0.5 = green/yellow, 1 = red
      const hue = (1 - value) * 240; 
      return `hsl(${hue}, 100%, 50%)`;
    };

    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        const val = data[i * 32 + j];
        ctx.fillStyle = getColor(val);
        ctx.fillRect(j * cellW, i * cellH, cellW, cellH);
      }
    }
  }, [data, width, height]);

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', width, height, border: '1px solid var(--border-color)' }}>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
