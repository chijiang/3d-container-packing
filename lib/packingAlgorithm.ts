/**
 * 简单的3D装箱算法
 * 使用贪心算法，按体积从大到小排列，依次放置到容器中
 */

import { Box, Container, PackPosition, PackResult } from '../types';

/**
 * 3D空间中的可用位置点
 */
interface SpacePoint {
  x: number;
  y: number;
  z: number;
}

/**
 * 尝试在集装箱中放置一个箱子
 * 返回放置位置或null（如果无法放置）
 */
function tryPlaceBox(
  box: Box,
  container: Container,
  placedBoxes: Array<Box & PackPosition>
): PackPosition | null {
  const { length, width, height } = box;

  // 尝试6种旋转方向
  const rotations: Array<{ rotation: 'x' | 'y' | 'z', l: number, w: number, h: number }> = [
    { rotation: 'x', l: length, w: width, h: height },
    { rotation: 'y', l: width, w: height, h: length },
    { rotation: 'z', l: height, w: length, h: width },
    { rotation: 'x', l: width, w: length, h: height },
    { rotation: 'y', l: height, w: length, h: width },
    { rotation: 'z', l: length, w: height, h: width }
  ];

  // 尝试每种旋转方向
  for (const { rotation, l, w, h } of rotations) {
    // 遍历可能的放置位置
    for (let x = 0; x <= container.length - l; x += 10) {
      for (let y = 0; y <= container.width - w; y += 10) {
        for (let z = 0; z <= container.height - h; z += 10) {
          const position: PackPosition = { x, y, z, rotation };

          // 检查是否与已放置的箱子冲突
          if (!checkCollision({ ...box, ...position }, placedBoxes)) {
            return position;
          }
        }
      }
    }
  }

  return null;
}

/**
 * 检查箱子是否与已放置的箱子冲突
 */
function checkCollision(
  box: Box & PackPosition,
  placedBoxes: Array<Box & PackPosition>
): boolean {
  // 计算当前箱子的实际尺寸（考虑旋转）
  const boxSize = getRotatedSize(box.length, box.width, box.height, box.rotation);

  for (const placedBox of placedBoxes) {
    // 计算已放置箱子的实际尺寸
    const placedSize = getRotatedSize(placedBox.length, placedBox.width, placedBox.height, placedBox.rotation);

    // 检查两个箱子是否重叠
    const overlapX = Math.min(box.x + boxSize.l, placedBox.x + placedSize.l) - Math.max(box.x, placedBox.x) > 0;
    const overlapY = Math.min(box.y + boxSize.w, placedBox.y + placedSize.w) - Math.max(box.y, placedBox.y) > 0;
    const overlapZ = Math.min(box.z + boxSize.h, placedBox.z + placedSize.h) - Math.max(box.z, placedBox.z) > 0;

    if (overlapX && overlapY && overlapZ) {
      return true; // 发生碰撞
    }
  }

  return false;
}

/**
 * 根据旋转方向获取箱子的实际尺寸
 */
function getRotatedSize(
  length: number,
  width: number,
  height: number,
  rotation: 'x' | 'y' | 'z'
): { l: number; w: number; h: number } {
  switch (rotation) {
    case 'x':
      return { l: length, w: width, h: height };
    case 'y':
      return { l: width, w: height, h: length };
    case 'z':
      return { l: height, w: length, h: width };
    default:
      return { l: length, w: width, h: height };
  }
}

/**
 * 主装箱算法
 */
export function packBoxes(
  boxes: Box[],
  container: Container
): PackResult {
  // 按体积从大到小排序
  const sortedBoxes = [...boxes].sort((a, b) => {
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeB - volumeA;
  });

  const packedBoxes: Array<Box & PackPosition> = [];
  const unpackedBoxes: Box[] = [];

  // 依次尝试放置每个箱子
  for (const box of sortedBoxes) {
    const position = tryPlaceBox(box, container, packedBoxes);

    if (position) {
      packedBoxes.push({ ...box, ...position });
    } else {
      unpackedBoxes.push(box);
    }
  }

  // 计算统计信息
  const containerVolume = container.length * container.width * container.height;
  const packedVolume = packedBoxes.reduce(
    (sum, box) => sum + box.length * box.width * box.height,
    0
  );
  const utilizationRate = (packedVolume / containerVolume) * 100;

  return {
    boxes: packedBoxes,
    packedVolume,
    containerVolume,
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    unpackedBoxes
  };
}
