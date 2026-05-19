import { useEffect, useRef, useCallback } from 'react';
import { GameLoop } from '../../game-engine/GameLoop.js';
import { GameScene } from '../../game-engine/GameScene.js';

/**
 * React wrapper for the Canvas game engine
 */
export default function GameCanvas({ levelData, onComplete, onFail }) {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const sceneRef = useRef(null);
  const isTouchingRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
    }
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create game scene
    const scene = new GameScene(canvas, levelData);
    scene.onComplete = handleComplete;
    scene.onFail = onFail;
    sceneRef.current = scene;

    // Create game loop
    const loop = new GameLoop(
      canvas,
      (dt) => scene.update(dt),
      (ctx, w, h) => scene.render(ctx, w, h)
    );
    gameLoopRef.current = loop;
    loop.start();

    // Touch/Mouse handlers
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      isTouchingRef.current = true;
      const pos = getPos(e);
      scene.handleTouch(pos.x, pos.y);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isTouchingRef.current) return;
      const pos = getPos(e);
      scene.handleMouseMove(pos.x, pos.y);
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
    };

    const handleMouseMove = (e) => {
      const pos = getPos(e);
      scene.handleMouseMove(pos.x, pos.y);
    };

    const handleClick = (e) => {
      const pos = getPos(e);
      scene.handleTouch(pos.x, pos.y);
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      loop.destroy();
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [levelData, handleComplete, onFail]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        cursor: 'pointer'
      }}
    />
  );
}
