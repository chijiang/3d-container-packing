'use client';

/**
 * StatsPanel - 统计信息面板组件
 * 显示装箱结果的统计数据
 */

interface PackResult {
  boxes: any[];
  packedVolume: number;
  containerVolume: number;
  utilizationRate: number;
  unpackedBoxes: any[];
}

interface StatsPanelProps {
  packResult: PackResult | null;
  containerName: string;
}

export default function StatsPanel({ packResult, containerName }: StatsPanelProps) {
  if (!packResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">装箱统计</h3>
        <p className="text-gray-500">暂无数据</p>
      </div>
    );
  }

  const {
    boxes,
    packedVolume,
    containerVolume,
    utilizationRate,
    unpackedBoxes
  } = packResult;

  // 格式化数字
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 根据利用率选择颜色
  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 根据利用率选择进度条颜色
  const getUtilizationBarColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">装箱统计</h3>

      {/* 集装箱信息 */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500">使用集装箱</p>
        <p className="text-lg font-semibold text-gray-800">{containerName}</p>
      </div>

      {/* 核心统计 */}
      <div className="space-y-4">
        {/* 已装箱数量 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">已装箱数量</span>
          <span className="text-2xl font-bold text-gray-800">{boxes.length} 箱</span>
        </div>

        {/* 未装箱数量 */}
        {unpackedBoxes.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">未装箱数量</span>
            <span className="text-lg font-semibold text-red-600">{unpackedBoxes.length} 箱</span>
          </div>
        )}

        {/* 装箱体积 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">已装箱体积</span>
          <span className="text-lg font-semibold text-gray-800">
            {formatNumber(packedVolume / 1000000)} m³
          </span>
        </div>

        {/* 集装箱总体积 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">集装箱总体积</span>
          <span className="text-lg font-semibold text-gray-800">
            {formatNumber(containerVolume / 1000000)} m³
          </span>
        </div>

        {/* 利用率 - 进度条 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">空间利用率</span>
            <span className={`text-2xl font-bold ${getUtilizationColor(utilizationRate)}`}>
              {formatNumber(utilizationRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${getUtilizationBarColor(utilizationRate)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
        </div>

        {/* 建议信息 */}
        {unpackedBoxes.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <p className="text-sm text-yellow-700">
              ⚠️ 有 {unpackedBoxes.length} 件货物未能装入，请考虑：
            </p>
            <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
              <li>使用更大的集装箱</li>
              <li>减少货物数量</li>
              <li>调整部分货物尺寸</li>
            </ul>
          </div>
        )}

        {utilizationRate >= 80 && (
          <div className="bg-green-50 border-l-4 border-green-400 p-3">
            <p className="text-sm text-green-700">
              ✅ 空间利用率优秀，装箱效果良好！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
