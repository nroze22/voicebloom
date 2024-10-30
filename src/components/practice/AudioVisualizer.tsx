import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  audioLevel: number;
  isRecording: boolean;
}

export default function AudioVisualizer({ audioLevel, isRecording }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = 4;
    const barSpacing = 2;
    const numBars = Math.floor(width / (barWidth + barSpacing));
    const maxBarHeight = height * 0.8;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgb(var(--primary))';

      for (let i = 0; i < numBars; i++) {
        const barHeight = (Math.sin(i * 0.2 + Date.now() * 0.005) + 1) * 
          maxBarHeight * (audioLevel / 100) * 0.5;

        ctx.fillRect(
          i * (barWidth + barSpacing),
          height - barHeight,
          barWidth,
          barHeight
        );
      }

      if (isRecording) {
        requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  }, [audioLevel, isRecording]);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: isRecording ? 100 : 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden bg-muted/10 rounded-lg"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full h-full"
      />
    </motion.div>
  );
}