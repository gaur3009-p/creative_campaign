import React, { useState } from "react";
import { Campaign, CopyVariant, ImagePrompt } from "@/entities/all";
import { InvokeLLM, GenerateImage } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Target, Palette, BarChart3, Save, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CampaignForm from "../components/campaign/CampaignForm";
import GeneratedContent from "../components/campaign/GeneratedContent";

export default function CampaignBuilder() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState("setup");
    const [campaignData, setCampaignData] = useState({
        name: "",
        description: "",
        target_audience: "",
        objectives: [],
        budget: "",
        tone: "professional"
    });
    const [generatedContent, setGeneratedContent] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const generateContent = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const copyResponse = await InvokeLLM({
                prompt: `You are a world-class creative copywriter. Create 3 ad copy variants for:
                - Campaign: ${campaignData.name}, ${campaignData.description} 
                - Target: ${campaignData.target_audience}
                - Objectives: ${campaignData.objectives.join(", ")}
                - Tone: ${campaignData.tone}
                For each variant, create: a headline (max 60 chars), body text (max 150 chars), and a call-to-action (max 25 chars).`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        variants: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    headline: { type: "string" },
                                    body_text: { type: "string" },
                                    call_to_action: { type: "string" },
                                    variant_type: { type: "string", enum: ["A", "B", "C"] }
                                }
                            }
                        }
                    }
                }
            });

            const ctrResponse = await InvokeLLM({
                prompt: `You are an expert ML engineer. Predict the CTR for each variant:
                - Campaign: ${campaignData.name}, Target: ${campaignData.target_audience}, Budget: $${campaignData.budget}
                - Variants: ${JSON.stringify(copyResponse.variants)}
                Provide CTR predictions with confidence scores.`,
                response_json_schema: {
                    type: "object", 
                    properties: {
                        predictions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    variant_type: { type: "string" },
                                    predicted_ctr: { type: "number" },
                                    confidence_score: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });
            
            const imageResponse = await InvokeLLM({
                prompt: `Create 3 detailed AI image generation prompts for:
                - Campaign: ${campaignData.name}, ${campaignData.description}
                - Target: ${campaignData.target_audience}, Tone: ${campaignData.tone}`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        image_prompts: {
                            type: "array",
                            items: {
                                type: "object", 
                                properties: {
                                    prompt: { type: "string" },
                                    style: { type: "string" },
                                    dimensions: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const content = {
                copies: copyResponse.variants.map((variant, index) => ({
                    ...variant,
                    predicted_ctr: ctrResponse.predictions?.find(p => p.variant_type === variant.variant_type)?.predicted_ctr || 0,
                    confidence_score: ctrResponse.predictions?.find(p => p.variant_type === variant.variant_type)?.confidence_score || 0
                })),
                images: imageResponse.image_prompts,
            };

            setGeneratedContent(content);
            setCurrentStep("review");
        } catch (error) {
            console.error("Error generating content:", error);
            setError(error.message || "Failed to generate content. Please try again.");
        }
        setIsGenerating(false);
    };

    const saveCampaign = async () => {
        setIsSaving(true);
        try {
            const campaign = await Campaign.create({
                ...campaignData,
                status: "draft",
                budget: parseFloat(campaignData.budget) || 0
            });
            if (generatedContent?.copies) {
                await CopyVariant.bulkCreate(generatedContent.copies.map(c => ({ campaign_id: campaign.id, ...c, tone: campaignData.tone })));
            }
            if (generatedContent?.images) {
                await ImagePrompt.bulkCreate(generatedContent.images.map(i => ({ campaign_id: campaign.id, ...i })));
            }
            navigate(createPageUrl("Dashboard"));
        } catch (error) {
            console.error("Error saving campaign:", error);
            setError(error.message || "Failed to save campaign.");
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="flex items-center gap-4 mb-10">
                <Link to={createPageUrl("Dashboard")}>
                    <Button variant="outline" size="icon" className="btn-secondary rounded-full">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-bold text-white">Campaign Builder</h1>
                    <p className="text-gray-400 mt-1">Create and generate AI-powered marketing campaigns.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300">
                    <p>{error}</p>
                </div>
            )}

            <div className="mb-8">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        currentStep === "setup" ? "bg-orange-500/20 text-orange-300" : "text-gray-500"
                    }`}>
                        <Target className="w-4 h-4" />
                        1. Setup
                    </div>
                    <div className={`h-px flex-1 ${currentStep === "review" ? "bg-orange-400" : "bg-white/10"}`} />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        currentStep === "review" ? "bg-orange-500/20 text-orange-300" : "text-gray-500"
                    }`}>
                        <Sparkles className="w-4 h-4" />
                        2. Review & Save
                    </div>
                </div>
            </div>

            {currentStep === "setup" && (
                <CampaignForm 
                    campaignData={campaignData}
                    setCampaignData={setCampaignData}
                    onGenerate={generateContent}
                    isGenerating={isGenerating}
                />
            )}

            {currentStep === "review" && generatedContent && (
                <GeneratedContent 
                    content={generatedContent}
                    campaignData={campaignData}
                    onSave={saveCampaign}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}
