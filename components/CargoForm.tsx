'use client';

/**
 * CargoForm - 货物添加表单组件
 * 允许用户添加自定义尺寸的货物
 */

import { useState, FormEvent } from 'react';
import { Box } from '../types';

interface CargoFormProps {
  onAddBox: (box: Box) => void;
}

export default function CargoForm({ onAddBox }: CargoFormProps) {
  const [name, setName] = useState('');
  const [length, setLength] = useState(100);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [color, setColor] = useState('#4299e1');

  // 预定义颜色选项
  const colorOptions = [
    '#4299e1', // 蓝色
    '#48bb78', // 绿色
    '#ed8936', // 橙色
    '#f56565', // 红色
    '#9f7aea', // 紫色
    '#ed64a6', // 粉色
    '#ecc94b', // 黄色
    '#4a5568', // 灰色
  ];

  // 预设货物尺寸
  const presetSizes = [
    { name: '小箱', length: 50, width: 40, height: 30 },
    { name: '中箱', length: 80, width: 60, height: 50 },
    { name: '大箱', length: 120, width: 80, height: 60 },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('请输入货物名称');
      return;
    }

    const newBox: Box = {
      id: Date.now().toString(),
      name,
      length,
      width,
      height,
      color,
    };

    onAddBox(newBox);

    // 重置表单
    setName('');
    setLength(100);
    setWidth(50);
    setHeight(50);
    setColor('#4299e1');
  };

  const handlePreset = (preset: typeof presetSizes[0]) => {
    setName(preset.name);
    setLength(preset.length);
    setWidth(preset.width);
    setHeight(preset.height);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">添加货物</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 货物名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            货物名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：电子设备、纺织品..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 预设尺寸 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            预设尺寸
          </label>
          <div className="flex gap-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePreset(preset)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 尺寸输入 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              长度 (cm)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              宽度 (cm)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              高度 (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 颜色选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            颜色
          </label>
          <div className="flex gap-2">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-md border-2 transition-all ${
                  color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          添加货物
        </button>
      </form>
    </div>
  );
}
