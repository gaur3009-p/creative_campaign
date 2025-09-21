import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Target, DollarSign, Users, Loader2, X } from "lucide-react";

const toneOptions = ["professional", "casual", "urgent", "friendly", "authoritative"];
const objectiveOptions = ["Brand Awareness", "Lead Generation", "Sales Conversion", "Website Traffic"];

export default function CampaignForm({ campaignData, setCampaignData, onGenerate, isGenerating }) {
    const handleObjectiveToggle = (objective) => {
        const current = campaignData.objectives || [];
        const newObjectives = current.includes(objective) ? current.filter(obj => obj !== objective) : [...current, objective];
        setCampaignData({ ...campaignData, objectives: newObjectives });
    };

    const canGenerate = campaignData.name && campaignData.description && campaignData.target_audience;

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Campaign Name *</Label>
                    <Input id="name" placeholder="e.g., Summer 2025 Product Launch" value={campaignData.name} onChange={(e) => setCampaignData({...campaignData, name: e.target.value})} className="bg-white/5 border-white/10 text-white"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description *</Label>
                    <Textarea id="description" placeholder="Describe your campaign goals and key messages..." value={campaignData.description} onChange={(e) => setCampaignData({...campaignData, description: e.target.value})} className="bg-white/5 border-white/10 text-white h-24"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="audience" className="text-gray-300">Target Audience *</Label>
                    <Textarea id="audience" placeholder="e.g., Tech-savvy millennials aged 25-35 interested in AI" value={campaignData.target_audience} onChange={(e) => setCampaignData({...campaignData, target_audience: e.target.value})} className="bg-white/5 border-white/10 text-white h-20"/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget ($)</Label>
                        <Input id="budget" type="number" placeholder="10000" value={campaignData.budget} onChange={(e) => setCampaignData({...campaignData, budget: e.target.value})} className="bg-white/5 border-white/10 text-white"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Tone of Voice</Label>
                        <Select value={campaignData.tone} onValueChange={(value) => setCampaignData({...campaignData, tone: value})}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-white/20 text-white">{toneOptions.map(tone => <SelectItem key={tone} value={tone} className="capitalize focus:bg-orange-500/30">{tone}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                     <Label className="text-gray-300 mb-2 block">Campaign Objectives</Label>
                     <div className="flex flex-wrap gap-3">
                        {objectiveOptions.map(objective => (
                            <button key={objective} onClick={() => handleObjectiveToggle(objective)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${(campaignData.objectives || []).includes(objective) ? "border-orange-400/50 bg-orange-500/20 text-orange-300" : "border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                                {objective}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Generate Content</h3>
                    <p className="text-gray-400 text-sm mb-6">Our AI agents will create multiple ad variants, predict their performance, and generate image concepts based on your campaign details.</p>
                    <Button onClick={onGenerate} disabled={!canGenerate || isGenerating} className="w-full btn-primary py-6 text-base gap-2">
                        {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>) : (<><Sparkles className="w-5 h-5" /> Generate Campaign Content</>)}
                    </Button>
                    {!canGenerate && <p className="text-xs text-red-400 mt-3">* Please fill in all required fields to generate content.</p>}
                </div>
            </div>
        </div>
    );
}
