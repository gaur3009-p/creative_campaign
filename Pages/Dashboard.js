import React, { useState, useEffect } from "react";
import { Campaign, CopyVariant, ImagePrompt } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Plus, 
    ArrowRight
} from "lucide-react";

export default function Dashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const campaignData = await Campaign.list("-created_date", 10);
            setCampaigns(campaignData);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full">
            <div className="text-center max-w-4xl mx-auto pt-28 pb-20 px-6">
                <p className="text-lg font-semibold text-orange-400 mb-2">AI-Powered Marketing Suite</p>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    Harness the Power of AI for Your Campaigns
                </h1>
                <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
                    Accelerate your growth by connecting your marketing strategy to the world's most advanced AI campaign generation and analytics network.
                </p>
                <div className="mt-10 flex justify-center items-center gap-4">
                     <Link to={createPageUrl("CampaignBuilder")}>
                        <Button className="btn-primary px-7 py-6 text-base">
                            <Plus className="w-5 h-5 mr-2"/>
                            New Campaign
                        </Button>
                    </Link>
                     <Link to={createPageUrl("CampaignAnalytics")}>
                        <Button className="btn-secondary px-7 py-6 text-base group">
                            How it works
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20">
                 <div className="bg-white/5 rounded-2xl shadow-2xl p-8 border border-white/10">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Recent Campaigns</h2>
                        <Link to={createPageUrl("CampaignBuilder")}>
                            <Button variant="link" className="text-orange-400 hover:text-orange-300">
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                     {isLoading ? (
                        <div className="space-y-4">
                            <div className="h-16 rounded-lg bg-white/5 animate-pulse"></div>
                            <div className="h-16 rounded-lg bg-white/5 animate-pulse"></div>
                            <div className="h-16 rounded-lg bg-white/5 animate-pulse"></div>
                        </div>
                     ) : campaigns.length > 0 ? (
                        <div className="divide-y divide-white/10">
                            {campaigns.slice(0, 5).map(campaign => (
                                <div key={campaign.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white">{campaign.name}</p>
                                        <p className="text-sm text-gray-400">{campaign.target_audience}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`capitalize text-sm px-3 py-1 rounded-full ${
                                            campaign.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                            campaign.status === 'draft' ? 'bg-gray-500/20 text-gray-300' :
                                            'bg-blue-500/20 text-blue-300'
                                        }`}>{campaign.status}</span>
                                        <Button size="sm" className="btn-secondary">View</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                         <div className="text-center py-16 text-gray-500">
                            <h3 className="text-lg font-semibold text-white">No campaigns yet</h3>
                            <p className="mt-2">Start by creating your first AI-powered campaign.</p>
                         </div>
                     )}
                 </div>
            </div>
        </div>
    );
}
