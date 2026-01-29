'use client';

/**
 * 3D 集装箱装箱可视化 - 主页面
 * 整合所有组件，提供完整的用户界面
 */

import { useState } from 'react';
import Container3D from '@/components/Container3D';
import CargoForm from '@/components/CargoForm';
import StatsPanel from '@/components/StatsPanel';
import { Box, Container, CONTAINER_TYPES, PackResult } from '@/types';
import { packBoxes } from '@/lib/packingAlgorithm';

export default function Home() {
  // 状态管理
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container>(CONTAINER_TYPES['20ft']);
  const [packResult, setPackResult] = useState<PackResult | null>(null);
  const [isPacking, setIsPacking] = useState(false);

  // 添加货物
  const handleAddBox = (box: Box) => {
    setBoxes([...boxes, box]);
  };

  // 删除货物
  const handleRemoveBox = (boxId: string) => {
    setBoxes(boxes.filter((box) => box.id !== boxId));
    setPackResult(null); // 清除装箱结果
  };

  // 清空所有货物
  const handleClearAll = () => {
    setBoxes([]);
    setPackResult(null);
  };

  // 自动装箱
  const handleAutoPack = () => {
    setIsPacking(true);

    // 使用 setTimeout 让 UI 有机会更新 loading 状态
    setTimeout(() => {
      const result = packBoxes(boxes, selectedContainer);
      setPackResult(result);
      setIsPacking(false);
    }, 100);
  };

  // 添加示例数据
  const handleAddSampleData = () => {
    const sampleBoxes: Box[] = [
      {
        id: 'sample1',
        name: '电子设备A',
        length: 100,
        width: 80,
        height: 60,
        color: '#4299e1'
      },
      {
        id: 'sample2',
        name: '纺织品B',
        length: 80,
        width: 60,
        height: 50,
        color: '#48bb78'
      },
      {
        id: 'sample3',
        name: '家具C',
        length: 120,
        width: 70,
        height: 50,
        color: '#ed8936'
      },
      {
        id: 'sample4',
        name: '配件D',
        length: 60,
        width: 40,
        height: 40,
        color: '#f56565'
      },
      {
        id: 'sample5',
        name: '日用品E',
        length: 50,
        width: 40,
        height: 30,
        color: '#9f7aea'
      }
    ];

    setBoxes([...boxes, ...sampleBoxes]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📦 3D 集装箱装箱可视化
          </h1>
          <p className="text-gray-400">
            智能装箱方案展示系统 - 美观呈现各种尺寸货物在集装箱内的堆放方案
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 集装箱选择 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">集装箱选择</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedContainer(CONTAINER_TYPES['20ft'])}
                  className={`w-full px-4 py-3 rounded-md transition-colors ${
                    selectedContainer.id === '20ft'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  20英尺集装箱 (589×235×239cm)
                </button>
                <button
                  onClick={() => setSelectedContainer(CONTAINER_TYPES['40ft'])}
                  className={`w-full px-4 py-3 rounded-md transition-colors ${
                    selectedContainer.id === '40ft'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  40英尺集装箱 (1203×235×239cm)
                </button>
              </div>
            </div>

            {/* 货物表单 */}
            <CargoForm onAddBox={handleAddBox} />
          </div>

          {/* 中间：3D 视图 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3D 集装箱 */}
            <Container3D
              container={selectedContainer}
              boxes={packResult?.boxes || []}
            />

            {/* 货物列表和操作按钮 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  货物列表 ({boxes.length} 件)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSampleData}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    添加示例
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 自动装箱按钮 */}
              <button
                onClick={handleAutoPack}
                disabled={boxes.length === 0 || isPacking}
                className={`w-full py-4 mb-4 text-white font-semibold rounded-lg transition-all ${
                  boxes.length === 0 || isPacking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isPacking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    计算中...
                  </span>
                ) : (
                  '🚀 自动装箱'
                )}
              </button>

              {/* 货物列表 */}
              {boxes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无货物，请添加货物或点击"添加示例"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {boxes.map((box) => (
                    <div
                      key={box.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4"
                      style={{ borderLeftColor: box.color }}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{box.name}</p>
                        <p className="text-sm text-gray-500">
                          {box.length}×{box.width}×{box.height} cm
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveBox(box.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 统计面板 */}
            <StatsPanel
              packResult={packResult}
              containerName={selectedContainer.name}
            />
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>基于 Next.js + React Three Fiber + TypeScript 构建</p>
        </div>
      </div>
    </div>
  );
}
