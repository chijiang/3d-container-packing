/**
 * 3D装箱算法 - 改进版
 * 使用底层优先（Bottom-Left-Fill）算法，确保箱子从下往上紧密堆放
 */

import { Box, Container, PackPosition, PackResult } from '../types';

/**
 * 可用空间点
 */
interface AvailablePoint {
  x: number;
  y: number;  // 宽度方向
  z: number;  // 高度方向（垂直）
}

/**
 * 已放置箱子的边界
 */
interface PlacedBoxBounds {
  box: Box & PackPosition;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

/**
 * 根据旋转方向获取箱子的实际尺寸
 * 返回 { l: 长度方向, w: 宽度方向, h: 高度方向 }
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
      return { l: width, w: length, h: height };
    case 'z':
      return { l: length, w: height, h: width };
    default:
      return { l: length, w: width, h: height };
  }
}

/**
 * 计算已放置箱子的边界
 */
function getBoxBounds(box: Box & PackPosition): PlacedBoxBounds {
  const size = getRotatedSize(box.length, box.width, box.height, box.rotation);
  return {
    box,
    minX: box.x,
    maxX: box.x + size.l,
    minY: box.y,
    maxY: box.y + size.w,
    minZ: box.z,
    maxZ: box.z + size.h,
  };
}

/**
 * 检查箱子是否与已放置的箱子冲突
 */
function checkCollision(
  x: number, y: number, z: number,
  l: number, w: number, h: number,
  placedBounds: PlacedBoxBounds[]
): boolean {
  for (const placed of placedBounds) {
    // 检查两个箱子是否重叠（包含微小容差避免浮点误差）
    const tolerance = 0.1;
    const overlapX = (x + l > placed.minX + tolerance) && (x < placed.maxX - tolerance);
    const overlapY = (y + w > placed.minY + tolerance) && (y < placed.maxY - tolerance);
    const overlapZ = (z + h > placed.minZ + tolerance) && (z < placed.maxZ - tolerance);

    if (overlapX && overlapY && overlapZ) {
      return true; // 发生碰撞
    }
  }
  return false;
}

/**
 * 检查箱子是否在容器边界内
 */
function isWithinContainer(
  x: number, y: number, z: number,
  l: number, w: number, h: number,
  container: Container
): boolean {
  return (
    x >= 0 && x + l <= container.length &&
    y >= 0 && y + w <= container.width &&
    z >= 0 && z + h <= container.height
  );
}

/**
 * 检查箱子是否有支撑（在底部或有其他箱子支撑）
 */
function hasSupport(
  x: number, y: number, z: number,
  l: number, w: number,
  placedBounds: PlacedBoxBounds[]
): boolean {
  // 在地面上
  if (z < 0.1) {
    return true;
  }

  // 检查下方是否有支撑
  // 需要至少50%的底面积被支撑
  let supportedArea = 0;
  const boxArea = l * w;

  for (const placed of placedBounds) {
    // 检查是否在当前箱子正下方
    if (Math.abs(placed.maxZ - z) < 1) { // 允许1cm的误差
      // 计算重叠区域
      const overlapMinX = Math.max(x, placed.minX);
      const overlapMaxX = Math.min(x + l, placed.maxX);
      const overlapMinY = Math.max(y, placed.minY);
      const overlapMaxY = Math.min(y + w, placed.maxY);

      if (overlapMaxX > overlapMinX && overlapMaxY > overlapMinY) {
        supportedArea += (overlapMaxX - overlapMinX) * (overlapMaxY - overlapMinY);
      }
    }
  }

  // 需要至少30%的支撑
  return supportedArea >= boxArea * 0.3;
}

/**
 * 生成可用的放置位置点
 * 使用极点法（Extreme Points）生成候选位置
 */
function generateCandidatePoints(
  placedBounds: PlacedBoxBounds[],
  container: Container
): AvailablePoint[] {
  const points: AvailablePoint[] = [];

  // 起始点：原点（左下角）
  points.push({ x: 0, y: 0, z: 0 });

  // 从每个已放置的箱子生成新的候选点
  for (const placed of placedBounds) {
    // 在箱子的右边
    points.push({ x: placed.maxX, y: placed.minY, z: placed.minZ });
    // 在箱子的后面
    points.push({ x: placed.minX, y: placed.maxY, z: placed.minZ });
    // 在箱子的上面
    points.push({ x: placed.minX, y: placed.minY, z: placed.maxZ });
  }

  // 过滤掉超出容器边界的点
  return points.filter(p =>
    p.x >= 0 && p.x < container.length &&
    p.y >= 0 && p.y < container.width &&
    p.z >= 0 && p.z < container.height
  );
}

/**
 * 尝试在指定位置放置箱子
 */
function tryPlaceBoxAt(
  box: Box,
  point: AvailablePoint,
  container: Container,
  placedBounds: PlacedBoxBounds[]
): PackPosition | null {
  const rotations: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];

  for (const rotation of rotations) {
    const size = getRotatedSize(box.length, box.width, box.height, rotation);
    const { l, w, h } = size;

    // 检查是否在容器内
    if (!isWithinContainer(point.x, point.y, point.z, l, w, h, container)) {
      continue;
    }

    // 检查是否与其他箱子冲突
    if (checkCollision(point.x, point.y, point.z, l, w, h, placedBounds)) {
      continue;
    }

    // 检查是否有支撑
    if (!hasSupport(point.x, point.y, point.z, l, w, placedBounds)) {
      continue;
    }

    return {
      boxId: box.id,
      x: point.x,
      y: point.y,
      z: point.z,
      rotation
    };
  }

  return null;
}

/**
 * 主装箱算法 - 底层优先
 */
export function packBoxes(
  boxes: Box[],
  container: Container
): PackResult {
  // 按体积从大到小排序（大箱子优先）
  const sortedBoxes = [...boxes].sort((a, b) => {
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeB - volumeA;
  });

  const packedBoxes: Array<Box & PackPosition> = [];
  const placedBounds: PlacedBoxBounds[] = [];
  const unpackedBoxes: Box[] = [];

  // 依次尝试放置每个箱子
  for (const box of sortedBoxes) {
    // 生成候选点
    const candidatePoints = generateCandidatePoints(placedBounds, container);

    // 按照 z（高度）-> y（深度）-> x（长度）排序，优先放在底部
    candidatePoints.sort((a, b) => {
      if (a.z !== b.z) return a.z - b.z;       // 优先底部
      if (a.y !== b.y) return a.y - b.y;       // 其次靠前
      return a.x - b.x;                         // 最后靠左
    });

    let placed = false;

    for (const point of candidatePoints) {
      const position = tryPlaceBoxAt(box, point, container, placedBounds);

      if (position) {
        const packedBox = { ...box, ...position };
        packedBoxes.push(packedBox);
        placedBounds.push(getBoxBounds(packedBox));
        placed = true;
        break;
      }
    }

    if (!placed) {
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
