import React, { useState, useEffect } from 'react';
import { CampaignJudgement } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Loader2, Bot, Sparkles, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ScoreBar = ({ label, score }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-gray-300">{label}</span>
            <span className="font-semibold text-white">{score.toFixed(1)} / 10</span>
        </div>
        <Progress value={score * 10} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-yellow-500" />
    </div>
);

export default function JudgeBotAnalyzer({ campaign, onAnalysisComplete }) {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadAnalysis = async () => {
            const existing = await CampaignJudgement.filter({ campaign_id: campaign.id, judge_type: "ai_bot" });
            if (existing.length > 0) setAnalysis(existing[0]);
            else setAnalysis(null);
        };
        loadAnalysis();
    }, [campaign.id]);

    const runAnalysis = async () => {
        setIsLoading(true);
        try {
            const response = await InvokeLLM({
                prompt: `As an expert marketing campaign analyst bot, provide a detailed analysis for this campaign:
                Title: ${campaign.name}
                Description: ${campaign.description}
                Target: ${campaign.target_audience}
                Objectives: ${campaign.objectives.join(", ")}
                
                Score the following from 0-10: Visual Appeal, Message Clarity, Target Relevance, CTA Strength, Brand Consistency.
                Also provide an Overall Effectiveness Score (0-10), detailed feedback, and 3 improvement recommendations.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overall_effectiveness_score: { type: "number" },
                        visual_appeal_score: { type: "number" },
                        message_clarity_score: { type: "number" },
                        target_relevance_score: { type: "number" },
                        cta_strength_score: { type: "number" },
                        brand_consistency_score: { type: "number" },
                        detailed_feedback: { type: "string" },
                        improvement_recommendations: { type: "array", items: { type: "string" }}
                    }
                }
            });
            const newAnalysis = await CampaignJudgement.create({
                campaign_id: campaign.id,
                judge_type: "ai_bot",
                judge_bot_analysis: response,
                status: "completed"
            });
            setAnalysis(newAnalysis);
            onAnalysisComplete(newAnalysis);
        } catch (error) { console.error("Error running analysis:", error); }
        setIsLoading(false);
    };

    return (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="w-10 h-10 mx-auto animate-spin text-orange-400" /><p className="mt-4 text-gray-300">Judge Bot is analyzing...</p></div>
            ) : analysis ? (
                <div className="space-y-8">
                    <div>
                        <div className="text-center mb-8">
                            <p className="text-gray-400">Overall Effectiveness Score</p>
                            <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 my-2">
                                {analysis.judge_bot_analysis.overall_effectiveness_score.toFixed(1)}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <ScoreBar label="Visual Appeal" score={analysis.judge_bot_analysis.visual_appeal_score} />
                            <ScoreBar label="Message Clarity" score={analysis.judge_bot_analysis.message_clarity_score} />
                            <ScoreBar label="Target Relevance" score={analysis.judge_bot_analysis.target_relevance_score} />
                            <ScoreBar label="CTA Strength" score={analysis.judge_bot_analysis.cta_strength_score} />
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="font-semibold text-white text-lg mb-3">Detailed Feedback</h4>
                        <p className="text-gray-300">{analysis.judge_bot_analysis.detailed_feedback}</p>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="font-semibold text-white text-lg mb-3">Improvement Recommendations</h4>
                        <ul className="space-y-3">
                            {analysis.judge_bot_analysis.improvement_recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" /><span>{rec}</span></li>
                            ))}
                        </ul>
                    </div>
                     <div className="text-center pt-4">
                        <Button onClick={runAnalysis} className="btn-secondary" disabled={isLoading}><Bot className="w-4 h-4 mr-2" />Re-analyze Campaign</Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <Bot className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white">Judge Bot Analysis</h3>
                    <p className="text-gray-400 mt-2 mb-6">Let our AI agent analyze your campaign for effectiveness and provide actionable feedback.</p>
                    <Button onClick={runAnalysis} className="btn-primary py-6 px-8 text-base" disabled={isLoading}><Sparkles className="w-5 h-5 mr-2" />Run Analysis</Button>
                </div>
            )}
        </div>
    );
}
