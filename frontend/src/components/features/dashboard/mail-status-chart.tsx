"use client";

import { Card } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface MailStatusChartProps {
    data: {
        incoming: Record<string, number>;
        outgoing: Record<string, number>;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function MailStatusChart({ data }: MailStatusChartProps) {
    const transformData = (record: Record<string, number>) => {
        return Object.entries(record).map(([name, value]) => ({ name, value }));
    };

    const incomingData = transformData(data.incoming);
    const outgoingData = transformData(data.outgoing);

    const renderChart = (title: string, chartData: any[]) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary/10 flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Belum ada data
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderChart("Status Surat Masuk", incomingData)}
            {renderChart("Status Surat Keluar", outgoingData)}
        </div>
    );
}
