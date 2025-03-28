import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

const SpeedometerGauge = ({
  worst,
  avg,
  best,
  belowPercent,
  abovePercent,
  keyProp,
  totalInvested,
  summary,
  results
}) => {
  const segments = 2;
  const segmentColors = ['red', 'green'];

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-10">
      {/* 📊 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-300 rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide flex items-center gap-1">
            <span>📉</span> Lowest Return
          </h3>
          <p className="text-2xl font-extrabold text-red-800 mt-2">${summary.worst_final}</p>
          <p className="text-sm text-gray-600">{summary.min_cagr}% CAGR</p>
          <p className="text-xs text-gray-500 text-center mt-2">
            {summary.worst_start} → {summary.worst_end}<br />
            ${summary.worst_initial_price} → ${summary.worst_final_price}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wide flex items-center gap-1">
            <span>📊</span> Average Return
          </h3>
          <p className="text-2xl font-extrabold text-yellow-800 mt-2">${summary.avg_final}</p>
          <p className="text-sm text-gray-600">{summary.avg_cagr}% CAGR</p>
          <p className="text-xs text-gray-400 mt-2 text-center">Based on {results.length} simulations</p>
        </div>

        <div className="bg-green-50 border border-green-300 rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide flex items-center gap-1">
            <span>📈</span> Highest Return
          </h3>
          <p className="text-2xl font-extrabold text-green-800 mt-2">${summary.best_final}</p>
          <p className="text-sm text-gray-600">{summary.max_cagr}% CAGR</p>
          <p className="text-xs text-gray-500 text-center mt-2">
            {summary.best_start} → {summary.best_end}<br />
            ${summary.best_initial_price} → ${summary.best_final_price}
          </p>
        </div>
      </div>

      {/* 💰 Total Invested */}
      <div className="text-gray-700 font-medium text-base">
        💰 Total Invested Amount: ${totalInvested.toLocaleString()}
      </div>

      {/* 📈 Speedometer */}
      <ReactSpeedometer
        key={keyProp}
        minValue={worst}
        maxValue={best}
        value={avg}
        segments={segments}
        segmentColors={segmentColors}
        customSegmentStops={[worst, avg, best]}
        width={500}
        height={300}
        ringWidth={40}
        needleColor="orange"
        currentValueText={`Avg Return: ${avg}%`}
        needleTransitionDuration={2000}
        needleTransition="easeElastic"
        valueFormat={">.2f"}
      />
    </div>
  );
};
export default SpeedometerGauge;
