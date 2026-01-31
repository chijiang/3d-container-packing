'use client';

/**
 * Container3D - 3D集装箱渲染组件
 * 使用 React Three Fiber 渲染集装箱和其中的货物
 */

import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Container, PackPosition, Box } from '../types';

interface Container3DProps {
  container: Container;
  boxes: Array<Box & PackPosition>;
}

// 缩放因子：将厘米转换为场景单位
const SCALE = 0.01;

/**
 * 集装箱边框 - 使用线框显示
 */
function ContainerFrame({ container }: { container: Container }) {
  const length = container.length * SCALE;
  const width = container.width * SCALE;
  const height = container.height * SCALE;

  // 创建集装箱的边缘线条
  const edgesGeometry = useMemo(() => {
    const box = new THREE.BoxGeometry(length, height, width);
    return new THREE.EdgesGeometry(box);
  }, [length, width, height]);

  // 创建地板网格线
  const floorGridPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const step = 0.5; // 50cm 网格

    // 横向线
    for (let z = 0; z <= width; z += step) {
      points.push(new THREE.Vector3(0, 0, z));
      points.push(new THREE.Vector3(length, 0, z));
    }
    // 纵向线
    for (let x = 0; x <= length; x += step) {
      points.push(new THREE.Vector3(x, 0, 0));
      points.push(new THREE.Vector3(x, 0, width));
    }

    return points;
  }, [length, width]);

  const floorGridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(floorGridPoints);
    return geometry;
  }, [floorGridPoints]);

  return (
    <group position={[length / 2, height / 2, width / 2]}>
      {/* 集装箱边框线 */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#60a5fa" linewidth={2} />
      </lineSegments>

      {/* 集装箱底部 - 实心深色地板 */}
      <mesh position={[0, -height / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 地板网格线 */}
      <lineSegments
        geometry={floorGridGeometry}
        position={[-length / 2, -height / 2 + 0.01, -width / 2]}
      >
        <lineBasicMaterial color="#334155" />
      </lineSegments>

      {/* 添加角落加强筋 */}
      <CornerFrames length={length} width={width} height={height} />
    </group>
  );
}

/**
 * 集装箱角落加强筋
 */
function CornerFrames({ length, width, height }: { length: number; width: number; height: number }) {
  const frameSize = 0.03;
  const frameLength = 0.15;
  const color = "#94a3b8";

  // 只创建8个角落的L型支架
  const corners = useMemo(() => {
    const c = [];
    const positions = [
      [-length / 2, -height / 2, -width / 2],
      [length / 2, -height / 2, -width / 2],
      [-length / 2, -height / 2, width / 2],
      [length / 2, -height / 2, width / 2],
      [-length / 2, height / 2, -width / 2],
      [length / 2, height / 2, -width / 2],
      [-length / 2, height / 2, width / 2],
      [length / 2, height / 2, width / 2],
    ];

    for (const [px, py, pz] of positions) {
      const signX = px < 0 ? 1 : -1;
      const signY = py < 0 ? 1 : -1;
      const signZ = pz < 0 ? 1 : -1;

      // 沿X轴的条
      c.push({
        pos: [px + signX * frameLength / 2, py + signY * frameSize / 2, pz + signZ * frameSize / 2],
        size: [frameLength, frameSize, frameSize]
      });
      // 沿Y轴的条
      c.push({
        pos: [px + signX * frameSize / 2, py + signY * frameLength / 2, pz + signZ * frameSize / 2],
        size: [frameSize, frameLength, frameSize]
      });
      // 沿Z轴的条
      c.push({
        pos: [px + signX * frameSize / 2, py + signY * frameSize / 2, pz + signZ * frameLength / 2],
        size: [frameSize, frameSize, frameLength]
      });
    }

    return c;
  }, [length, width, height]);

  return (
    <>
      {corners.map((corner, i) => (
        <mesh key={i} position={corner.pos as [number, number, number]}>
          <boxGeometry args={corner.size as [number, number, number]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </>
  );
}

/**
 * 单个货物箱子 - 不透明材质
 */
function BoxMesh({ box, index }: { box: Box & PackPosition; index: number }) {
  // 货物尺寸（场景单位）
  const boxLength = box.length * SCALE;
  const boxWidth = box.width * SCALE;
  const boxHeight = box.height * SCALE;

  // 根据旋转方向调整尺寸
  // 算法中: l=长度方向, w=宽度方向, h=高度方向
  // Three.js中: x=长度, y=高度(垂直), z=宽度(深度)
  let displaySize: [number, number, number];
  switch (box.rotation) {
    case 'x':
      displaySize = [boxLength, boxHeight, boxWidth];
      break;
    case 'y':
      displaySize = [boxWidth, boxHeight, boxLength];
      break;
    case 'z':
      displaySize = [boxLength, boxWidth, boxHeight];
      break;
    default:
      displaySize = [boxLength, boxHeight, boxWidth];
      break;
  }

  // 位置计算：算法坐标转换为Three.js坐标
  const position: [number, number, number] = [
    box.x * SCALE + displaySize[0] / 2,
    box.z * SCALE + displaySize[1] / 2,
    box.y * SCALE + displaySize[2] / 2,
  ];

  // 创建边缘几何体
  const edgesGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(...displaySize);
    return new THREE.EdgesGeometry(geom);
  }, [displaySize[0], displaySize[1], displaySize[2]]);

  // 稍微调暗的边框颜色
  const edgeColor = useMemo(() => {
    const color = new THREE.Color(box.color || '#4299e1');
    color.multiplyScalar(0.7);
    return '#' + color.getHexString();
  }, [box.color]);

  return (
    <group position={position}>
      {/* 货物主体 - 不透明 */}
      <mesh castShadow receiveShadow renderOrder={index}>
        <boxGeometry args={displaySize} />
        <meshStandardMaterial
          color={box.color || '#4299e1'}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* 货物边框线 */}
      <lineSegments geometry={edgesGeometry} renderOrder={index + 1000}>
        <lineBasicMaterial color={edgeColor} />
      </lineSegments>
    </group>
  );
}

/**
 * 主容器组件
 */
export default function Container3D({ container, boxes }: Container3DProps) {
  const containerLength = container.length * SCALE;
  const containerWidth = container.width * SCALE;
  const containerHeight = container.height * SCALE;

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden relative">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          logarithmicDepthBuffer: true  // 减少 z-fighting
        }}
      >
        {/* 相机 */}
        <PerspectiveCamera
          makeDefault
          position={[containerLength * 1.5, containerHeight * 1.8, containerWidth * 2.5]}
          fov={45}
          near={0.01}
          far={100}
        />

        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.4} />
        <pointLight position={[containerLength, containerHeight * 2, containerWidth]} intensity={0.3} />

        {/* 控制器 */}
        <OrbitControls
          target={[containerLength / 2, containerHeight / 2, containerWidth / 2]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          minDistance={1}
          maxDistance={30}
        />

        {/* 背景网格 */}
        <Grid
          position={[containerLength / 2, 0, containerWidth / 2]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#334155"
          fadeDistance={30}
          fadeStrength={1}
        />

        {/* 集装箱边框 */}
        <ContainerFrame container={container} />

        {/* 货物 - 按位置排序渲染 */}
        {boxes.map((box, index) => (
          <BoxMesh key={box.id || index} box={box} index={index} />
        ))}
      </Canvas>

      {/* 提示信息 */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm border border-slate-600">
        <p>🖱️ 拖拽旋转 | 滚轮缩放 | 右键平移</p>
      </div>

      {/* 集装箱信息 */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm border border-slate-600">
        <p className="font-semibold text-blue-400">{container.name}</p>
        <p className="text-slate-300 text-xs mt-1">
          {container.length} × {container.width} × {container.height} cm
        </p>
        <p className="text-slate-400 text-xs mt-1">
          已装载 {boxes.length} 个货物
        </p>
      </div>
    </div>
  );
}
