'use client';

/**
 * BoxItem - 单个货物（箱子）的3D渲染组件
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PackPosition } from '../types';

interface BoxItemProps {
  box: any & PackPosition;
}

/**
 * 货物3D模型
 */
export default function BoxItem({ box }: BoxItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 转换为3D场景单位（米）
  const position = [
    (box.x - box.length / 2) / 100,
    (box.y - box.width / 2) / 100,
    (box.z - box.height / 2) / 100
  ];

  // 根据旋转方向计算尺寸
  let size = [box.length / 100, box.width / 100, box.height / 100];
  let rotation: [number, number, number] = [0, 0, 0];

  switch (box.rotation) {
    case 'x':
      size = [box.length / 100, box.width / 100, box.height / 100];
      rotation = [0, 0, 0];
      break;
    case 'y':
      size = [box.width / 100, box.height / 100, box.length / 100];
      rotation = [0, 0, Math.PI / 2];
      break;
    case 'z':
      size = [box.height / 100, box.length / 100, box.width / 100];
      rotation = [Math.PI / 2, 0, 0];
      break;
  }

  // 简单的悬浮动画效果
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.001;
    }
  });

  return (
    <group position={position as [number, number, number]} rotation={rotation}>
      {/* 货物主体 */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={size as [number, number, number]} />
        <meshStandardMaterial
          color={box.color || '#4299e1'}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 货物边框线 - 增强视觉效果 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color="#ffffff" linewidth={1} />
      </lineSegments>

      {/* 货物标签 */}
      <Text
        position={[0, size[1] / 2 + 0.05, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {box.name || 'Box'}
      </Text>

      {/* 尺寸标注 */}
      <Text
        position={[0, -size[1] / 2 - 0.1, 0]}
        fontSize={0.05}
        color="#a0aec0"
        anchorX="center"
        anchorY="middle"
      >
        {`${box.length}×${box.width}×${box.height}`}
      </Text>
    </group>
  );
}
