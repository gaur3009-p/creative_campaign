import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Percent } from "lucide-react";

export default function VariantComparisonCard({ variant }) {
    const perf = variant.performance_data || {};
    const actualCTR = perf.impressions > 0 ? (perf.clicks / perf.impressions * 100) : 0;
    const predictedCTR = (variant.predicted_ctr || 0) * 100;

    return (
        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">Variant {variant.variant_type}</CardTitle>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">{variant.tone}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">Headline</p>
                    <p className="font-semibold text-gray-800">{variant.headline}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Body</p>
                    <p className="text-gray-600 text-sm">{variant.body_text}</p>
                </div>
                <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500">Call to Action</p>
                    <Badge className="bg-blue-100 text-blue-800">{variant.call_to_action}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4 text-green-500" /> Actual CTR</p>
                        <p className="text-2xl font-bold text-green-600">{actualCTR.toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1"><Percent className="w-4 h-4 text-purple-500" /> Predicted CTR</p>
                        <p className="text-2xl font-bold text-purple-600">{predictedCTR.toFixed(2)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
