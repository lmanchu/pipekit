import React from 'react';
import { Deal, PipelineStage } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface AnalyticsViewProps {
  deals: Deal[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ deals }) => {
  // Calculate metrics
  const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);
  const activeDealsCount = deals.filter(d => d.stage !== PipelineStage.WON && d.stage !== PipelineStage.LOST).length;
  const wonDeals = deals.filter(d => d.stage === PipelineStage.WON);
  const lostDeals = deals.filter(d => d.stage === PipelineStage.LOST);
  const winRate = (wonDeals.length + lostDeals.length) > 0 
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) 
    : 0;

  // Prepare Chart Data: Value by Stage
  const dataByStage = Object.values(PipelineStage).map(stage => ({
    name: stage,
    value: deals.filter(d => d.stage === stage).reduce((acc, d) => acc + d.value, 0)
  }));

  const COLORS = ['#94a3b8', '#60a5fa', '#3b82f6', '#2563eb', '#16a34a', '#ef4444'];

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Pipeline Value</h3>
            <div className="text-3xl font-bold text-gray-900">${totalPipelineValue.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-2">↑ 12% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Win Rate</h3>
            <div className="text-3xl font-bold text-gray-900">{winRate}%</div>
            <div className="text-xs text-gray-500 mt-2">Based on {wonDeals.length + lostDeals.length} closed deals</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Deals</h3>
            <div className="text-3xl font-bold text-gray-900">{activeDealsCount}</div>
            <div className="text-xs text-gray-500 mt-2">Requires action</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Pipeline Value by Stage</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByStage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Deal Distribution</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataByStage.filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                             {dataByStage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
