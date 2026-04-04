"use client";

import { useRef, useState } from "react";

export function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  function getCoordinates(event: React.MouseEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function startDraw(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    setDrawing(true);
  }

  function draw(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    setDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-50">Whiteboard</h3>
        <button
          type="button"
          className="rounded-lg border border-slate-700 text-slate-400 px-2 py-1 text-xs font-semibold hover:bg-slate-800"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={900}
        height={320}
        className="w-full rounded-lg border border-slate-700 bg-slate-950"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
    </section>
  );
}
