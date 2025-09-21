import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function PerformanceSummary({ variants, isLoading }) {
    if (isLoading) {
        return <Skeleton className="h-48 w-full" />;
    }

    if (!variants || variants.length === 0) {
        return null;
    }

    const getWinner = () => {
        return variants.reduce((winner, current) => {
            const winnerCTR = (winner.performance_data?.clicks / winner.performance_data?.impressions) || 0;
            const currentCTR = (current.performance_data?.clicks / current.performance_data?.impressions) || 0;
            return currentCTR > winnerCTR ? current : winner;
        }, variants[0]);
    };

    const winner = getWinner();
    const winnerCTR = ((winner.performance_data?.clicks / winner.performance_data?.impressions) || 0) * 100;
    
    const chartData = variants.map(v => ({
        name: `Variant ${v.variant_type}`,
        'Actual CTR': ((v.performance_data?.clicks / v.performance_data?.impressions) * 100 || 0).toFixed(2),
        'Predicted CTR': ((v.predicted_ctr || 0) * 100).toFixed(2)
    }));

    return (
        <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center bg-green-50/80 p-6 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                        <Trophy className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">Top Performing Variant</h3>
                    </div>
                    <p className="text-5xl font-bold text-green-600 my-2">Variant {winner.variant_type}</p>
                    <p className="text-lg font-medium text-green-700">
                        Achieved an actual CTR of <span className="font-bold">{winnerCTR.toFixed(2)}%</span>
                    </p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                            <Bar dataKey="Predicted CTR" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Actual CTR" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
