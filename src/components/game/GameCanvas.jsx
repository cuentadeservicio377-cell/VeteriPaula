import { useEffect, useRef, useCallback } from 'react';
import { GameLoop } from '../../game-engine/GameLoop.js';
import { GameScene } from '../../game-engine/GameScene.js';
import { useTTS } from '../../hooks/useTTS.js';
import { stopTTS } from '../../utils/tts.js';

export default function GameCanvas({ levelData, onComplete, onFail }) {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const sceneRef = useRef(null);
  const isDraggingRef = useRef(false);
  // Register TTS globally for Canvas engine
  useTTS();

  const handleComplete = useCallback(() => {
    if (gameLoopRef.current) gameLoopRef.current.stop();
    const failCount = sceneRef.current?.failCount || 0;
    if (onComplete) onComplete(failCount);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has correct size before creating scene
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const scene = new GameScene(canvas, levelData);
    scene.onComplete = handleComplete;
    scene.onFail = onFail;
    sceneRef.current = scene;

    const loop = new GameLoop(
      canvas,
      (dt) => scene.update(dt),
      (ctx, w, h) => scene.render(ctx, w, h)
    );
    gameLoopRef.current = loop;
    loop.start();

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      const pos = getPos(e);
      scene.handleTouch(pos.x, pos.y);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDraggingRef.current) return;
      const pos = getPos(e);
      scene.handleTouchMove(pos.x, pos.y);
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      isDraggingRef.current = false;
      scene.handleTouchEnd();
    };

    const handleMouseMove = (e) => {
      const pos = getPos(e);
      scene.handleMouseMove(pos.x, pos.y);
    };

    const handleMouseDown = (e) => {
      const pos = getPos(e);
      scene.handleTouch(pos.x, pos.y);
    };

    const handleMouseUp = () => {
      scene.handleTouchEnd();
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      stopTTS();
      loop.destroy();
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [levelData, handleComplete, onFail]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', cursor: 'pointer' }}
    />
  );
}
