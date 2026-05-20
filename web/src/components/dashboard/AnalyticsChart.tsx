'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;
  colors?: string[];
}

const COLORS = ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type,
  dataKey,
  colors = COLORS,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          )}

          {type === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} />
            </BarChart>
          )}

          {type === 'pie' && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);
