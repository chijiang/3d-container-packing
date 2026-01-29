'use client';

/**
 * Container3D - 3D集装箱渲染组件
 * 使用 React Three Fiber 渲染集装箱和其中的货物
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Container, PackPosition } from '../types';
import BoxItem from './BoxItem';

interface Container3DProps {
  container: Container;
  boxes: Array<any & PackPosition>;
}

/**
 * 集装箱网格模型
 */
function ContainerMesh({ container }: { container: Container }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 集装箱尺寸（转换为米，3D场景中使用米作为单位）
  const length = container.length / 100;
  const width = container.width / 100;
  const height = container.height / 100;

  return (
    <group>
      {/* 集装箱外框 - 使用线框显示 */}
      <lineSegments ref={meshRef}>
        <boxGeometry args={[length, width, height]} />
        <lineBasicMaterial color="#4a5568" linewidth={2} />
      </lineSegments>

      {/* 集装箱底部 */}
      <mesh position={[0, -width / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#718096" opacity={0.3} transparent />
      </mesh>

      {/* 集装箱尺寸标注 */}
      <mesh position={[length / 2 + 0.2, -width / 2, height / 2]}>
        <boxGeometry args={[0.02, width, height]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      <mesh position={[-length / 2 - 0.2, -width / 2, height / 2]}>
        <boxGeometry args={[0.02, width, height]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </group>
  );
}

/**
 * 主容器组件
 */
export default function Container3D({ container, boxes }: Container3DProps) {
  return (
    <div className="w-full h-full min-h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <Canvas
        camera={{
          position: [3, 3, 3],
          fov: 50,
        }}
      >
        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />

        {/* 环境光照 */}
        <Environment preset="city" />

        {/* 控制器 - 允许旋转、缩放、平移 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />

        {/* 地面网格 */}
        <Grid
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#4a5568"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#718096"
          fadeDistance={20}
          fadeStrength={1}
        />

        {/* 集装箱 */}
        <ContainerMesh container={container} />

        {/* 货物 */}
        {boxes.map((box, index) => (
          <BoxItem key={box.id || index} box={box} />
        ))}
      </Canvas>

      {/* 提示信息 */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
        <p>🖱️ 拖拽旋转 | 滚轮缩放 | 右键平移</p>
      </div>
    </div>
  );
}
