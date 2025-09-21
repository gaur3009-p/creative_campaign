import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Eye, MousePointer, MoreHorizontal, Play, Pause } from "lucide-react";

const statusColors = {
    draft: "bg-slate-600 text-slate-200 border-slate-500",
    active: "bg-green-600/20 text-green-300 border-green-500/50",
    paused: "bg-yellow-600/20 text-yellow-300 border-yellow-500/50",
    completed: "bg-blue-600/20 text-blue-300 border-blue-500/50"
};

export default function CampaignCard({ campaign }) {
    const metrics = campaign.performance_metrics || {};
    
    return (
        <div className="p-4 rounded-xl border border-slate-700/80 hover:border-purple-500/80 bg-slate-800/50 hover:bg-slate-800 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-1">{campaign.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${statusColors[campaign.status]} font-medium`}>
                        {campaign.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{campaign.created_date && format(new Date(campaign.created_date), "MMM d")}</div>
                <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{(metrics.impressions || 0).toLocaleString()}</div>
                <div className="flex items-center gap-1.5"><MousePointer className="w-3.5 h-3.5" />{((metrics.clicks || 0) / (metrics.impressions || 1) * 100).toFixed(1)}%</div>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <span className="text-slate-400">Budget: </span>
                    <span className="font-medium text-white">${(campaign.budget || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                     {campaign.status === 'active' ? (
                        <Button size="sm" variant="outline" className="gap-1 bg-yellow-500/10 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20">
                            <Pause className="w-3 h-3" /> Pause
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" className="gap-1 bg-green-500/10 border-green-500/50 text-green-300 hover:bg-green-500/20">
                            <Play className="w-3 h-3" /> Start
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
