'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture } from '@react-three/drei';
import { Html } from '@react-three/drei';
import Plane from './plane.jsx'
import SuperBall from './SuperBall.jsx'

const planeH = 15;
const planeW = 10;


// paddle
const Paddle = ({position}) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 0.2, 0.2]} /> 
      <meshPhongMaterial color="red" />
    </mesh>
  );
};
// velocity is the distance done in the delta time v = ∆Distance / ∆time;
// ball + victory logic + paddle collision

const ThreeScene = () => {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [paddle1Pos, setPaddle1Pos] = useState([0, 0, (planeH / 2 ) - 0.1]);
  const [paddle2Pos, setPaddle2Pos] = useState([0, 0, -(planeH / 2) + 0.1]);
  useEffect(() => {
    let paddle1Direction = 0;
    let paddle2Direction = 0;
  
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          paddle1Direction = -1;
          break;
        case 'ArrowRight':
          paddle1Direction = 1;
          break;
        case 'a':
          paddle2Direction = -1;
          break;
        case 'd':
          paddle2Direction = 1;
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          paddle1Direction = 0;
          break;
        case 'a':
        case 'd':
          paddle2Direction = 0;
          break;
      }
    };
  
    const animate = () => {
      setPaddle1Pos(prev => [
        Math.max(Math.min(prev[0] + paddle1Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ]);
      setPaddle2Pos(prev => [
        Math.max(Math.min(prev[0] + paddle2Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ]);
      requestAnimationFrame(animate);
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animate();
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  //score and win
  const hanbleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  return (
    <div style={{ 
      width: '80vw', 
      height: '80vh', 
      minWidth: '1000px', 
      minHeight: '1000px',
    }}>
      <Canvas camera={{ position: [0, 10, 2], fov: 90 }}>
        <OrbitControls />
        <ambientLight intensity={0.4} />
        <Plane />
        <SuperBall paddlePositions={[
          {x: paddle1Pos[0], y: paddle1Pos[1], z: paddle1Pos[2]},
          {x: paddle2Pos[0], y: paddle2Pos[1], z: paddle2Pos[2]}
        ]} onScoreUpdate={hanbleScoreUpdate} />
        <Paddle position={paddle1Pos} />
        <Paddle position={paddle2Pos} />
      </Canvas>
    </div>
  );
};
export default ThreeScene;