
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, Stroke, AppMode } from '../types';

interface DrawingCanvasProps {
  mode: AppMode;
  color: string;
  strokeWidth: number;
  onUndoAvailabilityChange: (canUndo: boolean) => void;
  onStrokeCountChange?: (count: number) => void;
  triggerClear: number;
  triggerUndo: number;
  triggerExport: number;
  referenceShape?: Point[] | null;
  showReference?: boolean;
  onStrokesChange?: (strokes: Stroke[]) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  mode,
  color,
  strokeWidth,
  onUndoAvailabilityChange,
  onStrokeCountChange,
  triggerClear,
  triggerUndo,
  triggerExport,
  referenceShape,
  showReference,
  onStrokesChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [history, setHistory] = useState<Stroke[]>([]);
  const isDrawing = useRef(false);
  const currentPath = useRef<Point[]>([]);

  // Refs pour suivre le dernier état traité des triggers
  const lastClearRef = useRef(triggerClear);
  const lastUndoRef = useRef(triggerUndo);
  const lastExportRef = useRef(triggerExport);

  // Fonction de dessin d'un trait
  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number, alpha: number = 1) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  // Redessiner tout le canevas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Affichage de la référence (Mode Défi)
    if (showReference && referenceShape) {
       const size = Math.min(width, height) * 0.6;
       const offsetX = (width - size) / 2;
       const offsetY = (height - size) / 2;

       const scaledRef = referenceShape.map(p => ({
         x: p.x * size + offsetX,
         y: p.y * size + offsetY
       }));

       ctx.setLineDash([8, 8]);
       drawStroke(ctx, scaledRef, '#d6d3d1', 3, 0.5);
       ctx.setLineDash([]);
    }

    // Affichage de l'historique
    const isBlindMode = mode === AppMode.CHALLENGE && !showReference;
    
    if (!isBlindMode) {
      history.forEach(stroke => {
        drawStroke(ctx, stroke.points, stroke.color, stroke.width);
      });
    }

    // Affichage du trait en cours (Uniquement en mode Normal)
    if (isDrawing.current && currentPath.current.length > 0 && mode === AppMode.NORMAL) {
      drawStroke(ctx, currentPath.current, color, strokeWidth);
    }
  }, [history, referenceShape, showReference, mode, color, strokeWidth, drawStroke]);

  // Initialisation et Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        redrawCanvas();
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    
    handleResize();
    return () => resizeObserver.disconnect();
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handleStart = (x: number, y: number) => {
    if (mode === AppMode.CHALLENGE && showReference && history.length === 0) return; 
    isDrawing.current = true;
    currentPath.current = [{ x, y }];
    redrawCanvas();
  };

  const handleMove = (x: number, y: number) => {
    if (!isDrawing.current) return;
    currentPath.current.push({ x, y });
    redrawCanvas();
  };

  const handleEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentPath.current.length > 1) {
      const newStroke: Stroke = {
        points: [...currentPath.current],
        color: color,
        width: strokeWidth,
        isSilent: mode !== AppMode.NORMAL
      };
      
      setHistory(prev => {
        const next = [...prev, newStroke];
        if (onStrokesChange) onStrokesChange(next);
        return next;
      });
    }
    currentPath.current = [];
    redrawCanvas();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    handleStart(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    handleEnd();
  };

  // Actions externes avec vérification stricte du changement de trigger
  useEffect(() => {
    if (triggerClear > lastClearRef.current) {
      lastClearRef.current = triggerClear;
      setHistory([]);
      if (onStrokesChange) onStrokesChange([]);
    }
  }, [triggerClear, onStrokesChange]);

  useEffect(() => {
    if (triggerUndo > lastUndoRef.current) {
      lastUndoRef.current = triggerUndo;
      setHistory(prev => {
        const next = prev.slice(0, -1);
        if (onStrokesChange) onStrokesChange(next);
        return next;
      });
    }
  }, [triggerUndo, onStrokesChange]);

  useEffect(() => {
    if (triggerExport > lastExportRef.current && canvasRef.current) {
      lastExportRef.current = triggerExport;
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = w * 2;
      exportCanvas.height = h * 2;
      const eCtx = exportCanvas.getContext('2d');
      
      if (eCtx) {
        eCtx.scale(2, 2);
        eCtx.fillStyle = '#f5f5f4'; // stone-100
        eCtx.fillRect(0, 0, w, h);
        
        history.forEach(stroke => {
          drawStroke(eCtx, stroke.points, stroke.color, stroke.width);
        });

        const link = document.createElement('a');
        link.download = `silence-drawing-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png', 1.0);
        link.click();
      }
    }
  }, [triggerExport, history, drawStroke]);

  useEffect(() => {
    onUndoAvailabilityChange(history.length > 0);
    if (onStrokeCountChange) onStrokeCountChange(history.length);
  }, [history.length, onUndoAvailabilityChange, onStrokeCountChange]);

  return (
    <div ref={containerRef} className="w-full h-full touch-none cursor-crosshair overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={handleEnd}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
