/**
 * 类型定义 - 3D 集装箱装箱可视化
 */

/**
 * 货物（箱子）类型
 */
export interface Box {
  id: string;
  name: string;
  length: number;  // 长度 (cm)
  width: number;   // 宽度 (cm)
  height: number;  // 高度 (cm)
  color: string;   // 显示颜色
  quantity?: number; // 数量
}

/**
 * 集装箱类型
 */
export interface Container {
  id: string;
  name: string;
  length: number;  // 长度 (cm)
  width: number;   // 宽度 (cm)
  height: number;  // 高度 (cm)
}

/**
 * 装箱位置信息
 */
export interface PackPosition {
  boxId: string;
  x: number;  // x坐标 (cm)
  y: number;  // y坐标 (cm)
  z: number;  // z坐标 (cm)
  rotation: 'x' | 'y' | 'z'; // 旋转方向
}

/**
 * 装箱结果
 */
export interface PackResult {
  boxes: Array<Box & PackPosition>;
  packedVolume: number;
  containerVolume: number;
  utilizationRate: number; // 利用率 %
  unpackedBoxes: Box[];
}

/**
 * 预定义的集装箱尺寸（标准尺寸）
 */
export const CONTAINER_TYPES: Record<string, Container> = {
  '20ft': {
    id: '20ft',
    name: '20英尺集装箱',
    length: 589,  // cm
    width: 235,
    height: 239
  },
  '40ft': {
    id: '40ft',
    name: '40英尺集装箱',
    length: 1203, // cm
    width: 235,
    height: 239
  }
};
