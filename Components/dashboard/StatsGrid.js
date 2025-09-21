import React from 'react';
import { TrendingUp, Activity, Target, Eye, MousePointer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, change, isLoading }) => (
    <div className="p-[1px] bg-gradient-to-br from-purple-500/50 via-slate-800 to-lime-400/50 rounded-xl">
        <div className="bg-slate-800 rounded-[11px] h-full w-full p-6">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    {isLoading ? (
                        <Skeleton className="h-8 w-20 bg-slate-700" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{value}</p>
                    )}
                </div>
                <div className="p-3 bg-slate-700/50 rounded-xl">
                    <Icon className="w-6 h-6 text-purple-400" />
                </div>
            </div>
             {change && (
                <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
                    <TrendingUp className="w-3 h-3" />
                    {change} vs last period
                </div>
            )}
        </div>
    </div>
);

export default function StatsGrid({ stats, isLoading }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Campaigns" value={stats.totalCampaigns} icon={Activity} change="+12%" isLoading={isLoading} />
            <StatCard title="Active Campaigns" value={stats.activeCampaigns} icon={Target} change="+8%" isLoading={isLoading} />
            <StatCard title="Total Impressions" value={stats.totalImpressions.toLocaleString()} icon={Eye} change="+24%" isLoading={isLoading} />
            <StatCard title="Avg CTR" value={`${stats.avgCTR.toFixed(2)}%`} icon={MousePointer} change="+5.2%" isLoading={isLoading} />
            <StatCard title="Conversions" value={stats.totalConversions.toLocaleString()} icon={TrendingUp} change="+18%" isLoading={isLoading} />
        </div>
    );
}
