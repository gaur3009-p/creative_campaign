import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, BarChart3, Trophy, TrendingUp } from "lucide-react";

const VariationCard = ({ variation, onEdit, onAnalyze, isTopPerformer }) => {
    return (
        <Card className={`relative ${isTopPerformer ? 'ring-2 ring-gold-400 shadow-lg' : 'hover:shadow-md'} transition-all duration-200`}>
            {isTopPerformer && (
                <div className="absolute -top-3 left-4 z-10">
                    <Badge className="bg-yellow-500 text-white shadow-md">
                        <Trophy className="w-3 h-3 mr-1" />
                        Top Performer
                    </Badge>
                </div>
            )}
            
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Variation {variation.variation_type}</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(variation)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onAnalyze(variation)}>
                            <BarChart3 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {/* Image Preview */}
                {variation.image_url && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                            src={variation.image_url} 
                            alt={`Variation ${variation.variation_type}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                
                {/* Text Content */}
                <div className="space-y-2">
                    <div>
                        <h4 className="font-semibold text-gray-900">{variation.headline}</h4>
                        {variation.subheadline && (
                            <p className="text-sm text-gray-600">{variation.subheadline}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {variation.cta_text}
                        </Badge>
                        {variation.performance_prediction && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <TrendingUp className="w-3 h-3" />
                                {(variation.performance_prediction.predicted_ctr * 100).toFixed(1)}% CTR
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Performance Metrics */}
                {variation.performance_prediction && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Engagement</p>
                            <p className="font-semibold text-sm">
                                {(variation.performance_prediction.engagement_score * 10).toFixed(1)}/10
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Brand Fit</p>
                            <p className="font-semibold text-sm">
                                {(variation.performance_prediction.brand_fit_score * 10).toFixed(1)}/10
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function VariationGrid({ variations, onEditVariation, onAnalyzeVariation }) {
    // Find top performer based on predicted CTR
    const topPerformer = variations.reduce((best, current) => {
        if (!best || !current.performance_prediction || !best.performance_prediction) return best || current;
        return current.performance_prediction.predicted_ctr > best.performance_prediction.predicted_ctr ? current : best;
    }, null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Campaign Variations</h3>
                <Badge variant="outline">
                    {variations.length} Variation{variations.length !== 1 ? 's' : ''} Generated
                </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variations.map(variation => (
                    <VariationCard
                        key={variation.id}
                        variation={variation}
                        onEdit={onEditVariation}
                        onAnalyze={onAnalyzeVariation}
                        isTopPerformer={topPerformer && variation.id === topPerformer.id}
                    />
                ))}
            </div>
        </div>
    );
}
