import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function PerformanceChart({ campaigns, isLoading }) {
    const getChartData = () => {
        return campaigns.slice(0, 5).map(campaign => ({
            name: campaign.name.substring(0, 15) + "...",
            ctr: ((campaign.performance_metrics?.clicks || 0) / (campaign.performance_metrics?.impressions || 1) * 100).toFixed(1),
            impressions: campaign.performance_metrics?.impressions || 0
        }));
    };

    return (
        <Card className="card-shadow border-0">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Performance Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-2 w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="space-y-4">
                        {getChartData().map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                    <span className="text-gray-600">{item.ctr}% CTR</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                                        style={{ width: `${Math.min(parseFloat(item.ctr) * 10, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    {parseInt(item.impressions).toLocaleString()} impressions
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No performance data yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
