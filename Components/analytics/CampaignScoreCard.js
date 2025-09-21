import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Sparkles } from "lucide-react";

export default function CampaignScoreCard({ analytics, onImprove, onFinalize, isImproving }) {
    const getScoreColor = (score) => {
        if (score >= 0.75) return "text-green-600";
        if (score >= 0.5) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBackground = (score) => {
        if (score >= 0.75) return "bg-green-50 border-green-200";
        if (score >= 0.5) return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    const getScoreIcon = (score) => {
        if (score >= 0.75) return <CheckCircle className="w-5 h-5 text-green-600" />;
        if (score >= 0.5) return <TrendingUp className="w-5 h-5 text-yellow-600" />;
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    };

    return (
        <Card className={`${getScoreBackground(analytics.overall_score)} border-2`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {getScoreIcon(analytics.overall_score)}
                        Campaign Score
                    </CardTitle>
                    <Badge variant={analytics.status === 'finalized' ? 'default' : 'secondary'}>
                        {analytics.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analytics.overall_score)} mb-2`}>
                        {(analytics.overall_score * 10).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">
                        Iteration: {analytics.iteration_count}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Copy Quality</span>
                            <span className={getScoreColor(analytics.copy_score)}>
                                {(analytics.copy_score * 10).toFixed(1)}
                            </span>
                        </div>
                        <Progress value={analytics.copy_score * 100} className="h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Design Quality</span>
                            <span className={getScoreColor(analytics.design_score)}>
                                {(analytics.design_score * 10).toFixed(1)}
                            </span>
                        </div>
                        <Progress value={analytics.design_score * 100} className="h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>CTA Effectiveness</span>
                            <span className={getScoreColor(analytics.cta_effectiveness)}>
                                {(analytics.cta_effectiveness * 10).toFixed(1)}
                            </span>
                        </div>
                        <Progress value={analytics.cta_effectiveness * 100} className="h-2" />
                    </div>
                </div>

                {analytics.improvement_suggestions && analytics.improvement_suggestions.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Improvement Suggestions:</h4>
                        <ul className="text-xs space-y-1">
                            {analytics.improvement_suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-600">•</span>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-2">
                    {analytics.overall_score < 0.75 ? (
                        <Button 
                            onClick={onImprove}
                            disabled={isImproving}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            {isImproving ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Improving...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Auto-Improve
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button 
                            onClick={onFinalize}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finalize Campaign
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
