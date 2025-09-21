import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, FileText, Image, TrendingUp } from "lucide-react";

export default function GeneratedContent({ content, campaignData, onSave, isSaving }) {
    return (
        <div className="space-y-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">{campaignData.name}</h2>
                    <p className="text-gray-400">Generated content is ready for review. Save to finalize your campaign draft.</p>
                </div>
                <Button onClick={onSave} disabled={isSaving} className="btn-primary py-6 px-8 text-base gap-2">
                    {isSaving ? (<><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>) : (<><Save className="w-5 h-5" /> Save Campaign</>)}
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> Copy Variants</h3>
                    {content.copies?.map((copy, index) => (
                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-base">Variant {copy.variant_type}</Badge>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Predicted CTR</p>
                                    <p className="text-lg font-bold text-orange-400">{(copy.predicted_ctr * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Headline</p>
                                <p className="font-semibold text-white">{copy.headline}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Body Text</p>
                                <p className="text-gray-300">{copy.body_text}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Call to Action</p>
                                <Badge className="bg-gray-700 text-white">{copy.call_to_action}</Badge>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Image className="w-5 h-5 text-orange-400" /> Image Concepts</h3>
                    {content.images?.map((image, index) => (
                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-gray-700 text-white text-base">Concept {index + 1}</Badge>
                                <Badge variant="outline" className="border-white/20 text-gray-300">{image.style}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Generation Prompt</p>
                                <p className="text-gray-300 leading-relaxed text-sm">{image.prompt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
