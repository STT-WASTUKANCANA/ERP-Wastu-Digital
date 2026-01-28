"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface MailCategoryChartProps {
    data: Record<string, number>;
}

export function MailCategoryChart({ data }: MailCategoryChartProps) {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name: name,
        Jumlah: value,
    }));

    // Generate colors or use a single color
    const barColor = "#8884d8";

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Kategori Populer (Surat Masuk)</h3>
            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 30,
                                left: 40,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={150}
                                tick={{ fill: '#4B5563', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="Jumlah" fill={barColor} radius={[0, 4, 4, 0]} barSize={32}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Belum ada data kategori
                    </div>
                )}
            </div>
        </div>
    );
}
