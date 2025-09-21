
import React, { useState, useEffect } from "react";
import { Campaign, CopyVariant, CampaignAnalytics } from "@/entities/all"; // Added CampaignAnalytics
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TestTube2, Percent, Trophy, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import VariantComparisonCard from "../components/ab/VariantComparisonCard";
import PerformanceSummary from "../components/ab/PerformanceSummary";
import CampaignScoreCard from "../components/analytics/CampaignScoreCard"; // Added CampaignScoreCard import

export default function ABManager() {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [variants, setVariants] = useState([]);
    const [analytics, setAnalytics] = useState([]); // New state for analytics
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);

    useEffect(() => {
        const loadCampaigns = async () => {
            setIsLoadingCampaigns(true);
            try {
                const campaignData = await Campaign.list();
                setCampaigns(campaignData);
                if (campaignData.length > 0) {
                    setSelectedCampaignId(campaignData[0].id);
                }
            } catch (error) {
                console.error("Error loading campaigns:", error);
            }
            setIsLoadingCampaigns(false);
        };
        loadCampaigns();
    }, []);

    useEffect(() => {
        if (selectedCampaignId) {
            const loadVariants = async () => {
                setIsLoadingVariants(true);
                try {
                    // Fetch both variants and analytics concurrently
                    const [variantData, analyticsData] = await Promise.all([
                        CopyVariant.filter({ campaign_id: selectedCampaignId }),
                        CampaignAnalytics.filter({ campaign_id: selectedCampaignId }) // Fetch campaign analytics
                    ]);
                    setVariants(variantData);
                    setAnalytics(analyticsData); // Set analytics data
                } catch (error) {
                    console.error("Error loading data:", error); // More generic error message
                }
                setIsLoadingVariants(false);
            };
            loadVariants();
        }
    }, [selectedCampaignId]);

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    // Find the analytics relevant to the selected campaign
    const campaignAnalytics = analytics.find(a => a.campaign_id === selectedCampaignId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            A/B Test Manager
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Compare variant performance and optimize campaigns automatically. {/* Updated text */}
                        </p>
                    </div>
                    {isLoadingCampaigns ? (
                        <Skeleton className="h-10 w-64" />
                    ) : (
                        <Select onValueChange={setSelectedCampaignId} value={selectedCampaignId}>
                            <SelectTrigger className="w-full md:w-[280px] bg-white shadow-sm">
                                <SelectValue placeholder="Select a campaign to analyze..." />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map(campaign => (
                                    <SelectItem key={campaign.id} value={campaign.id}>
                                        {campaign.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {selectedCampaign ? (
                    // New grid layout for CampaignScoreCard and other content
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Campaign Score */}
                        <div className="lg:col-span-1">
                            {isLoadingVariants ? ( // Use isLoadingVariants for CampaignScoreCard skeleton as well
                                <Card><CardContent className="p-4"><Skeleton className="h-64" /></CardContent></Card>
                            ) : campaignAnalytics ? (
                                <CampaignScoreCard 
                                    analytics={campaignAnalytics}
                                    onImprove={() => console.log("Improve campaign action")} // Placeholder handler
                                    onFinalize={() => console.log("Finalize campaign action")} // Placeholder handler
                                />
                            ) : (
                                <Card className="border-2 border-dashed border-gray-200">
                                    <CardContent className="p-6 text-center">
                                        <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">No analytics available</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        
                        {/* Performance and Variants */}
                        <div className="lg:col-span-3 space-y-6"> {/* Wrapped existing content */}
                            <PerformanceSummary variants={variants} isLoading={isLoadingVariants} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoadingVariants ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <Card key={i}><CardContent className="p-4"><Skeleton className="h-48" /></CardContent></Card>
                                    ))
                                ) : variants.length > 0 ? (
                                    variants.map(variant => (
                                        <VariantComparisonCard key={variant.id} variant={variant} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20">
                                        <TestTube2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-500">No Variants Found</h3>
                                        <p className="text-gray-400 mt-2">This campaign has no copy variants to compare.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">Select a Campaign</h3>
                        <p className="text-gray-400 mt-2">Choose a campaign from the dropdown to start your analysis.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
