"use client";

import { Card } from "@/components/ui/card"; // Assuming there is a generic Card or I'll genericize it
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface MailTrendChartProps {
    data: {
        labels: string[];
        incoming: number[];
        outgoing: number[];
        decision: number[];
    };
}

export function MailTrendChart({ data }: MailTrendChartProps) {
    // Transform data for Recharts
    const chartData = data.labels.map((label, index) => ({
        name: label,
        Masuk: data.incoming[index],
        Keluar: data.outgoing[index],
        Keputusan: data.decision[index],
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tren Aktivitas Surat (Bulanan)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="Masuk"
                            stroke="#3B82F6" // blue-500
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Keluar"
                            stroke="#10B981" // emerald-500
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Keputusan"
                            stroke="#8B5CF6" // violet-500
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
