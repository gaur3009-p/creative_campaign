import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Hash, Palette, X } from "lucide-react";

const CAMPAIGN_TYPES = [
    { value: "product_launch", label: "Product Launch" },
    { value: "brand_awareness", label: "Brand Awareness" },
    { value: "seasonal", label: "Seasonal Campaign" },
    { value: "promotional", label: "Promotional" },
    { value: "educational", label: "Educational" },
    { value: "event", label: "Event Marketing" }
];

const IMAGE_STYLES = [
    { value: "photographic", label: "Photographic" },
    { value: "illustration", label: "Illustration" },
    { value: "minimalist", label: "Minimalist" },
    { value: "bold_graphic", label: "Bold Graphic" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "product_focus", label: "Product Focus" }
];

const TONES = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "playful", label: "Playful" },
    { value: "urgent", label: "Urgent" },
    { value: "inspirational", label: "Inspirational" },
    { value: "authoritative", label: "Authoritative" }
];

export default function CampaignSetupForm({ onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        target_age_group: "",
        target_demographics: {
            gender: "all",
            income_level: "middle",
            interests: [],
            location: ""
        },
        main_keywords: [],
        campaign_type: "",
        content_preferences: {
            image_style: "photographic",
            tone: "professional",
            color_palette: "vibrant",
            text_length: "medium_descriptive"
        },
        success_metrics: []
    });

    const [currentKeyword, setCurrentKeyword] = useState("");
    const [currentInterest, setCurrentInterest] = useState("");

    const handleAddKeyword = () => {
        if (currentKeyword.trim() && !formData.main_keywords.includes(currentKeyword.trim())) {
            setFormData({
                ...formData,
                main_keywords: [...formData.main_keywords, currentKeyword.trim()]
            });
            setCurrentKeyword("");
        }
    };

    const handleAddInterest = () => {
        if (currentInterest.trim() && !formData.target_demographics.interests.includes(currentInterest.trim())) {
            setFormData({
                ...formData,
                target_demographics: {
                    ...formData.target_demographics,
                    interests: [...formData.target_demographics.interests, currentInterest.trim()]
                }
            });
            setCurrentInterest("");
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setFormData({
            ...formData,
            main_keywords: formData.main_keywords.filter(k => k !== keyword)
        });
    };

    const handleRemoveInterest = (interest) => {
        setFormData({
            ...formData,
            target_demographics: {
                ...formData.target_demographics,
                interests: formData.target_demographics.interests.filter(i => i !== interest)
            }
        });
    };

    const handleMetricToggle = (metric) => {
        const current = formData.success_metrics;
        if (current.includes(metric)) {
            setFormData({
                ...formData,
                success_metrics: current.filter(m => m !== metric)
            });
        } else {
            setFormData({
                ...formData,
                success_metrics: [...current, metric]
            });
        }
    };

    const canSubmit = formData.title && formData.description && formData.target_age_group && formData.campaign_type && formData.main_keywords.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Campaign Setup
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="title">Campaign Title *</Label>
                            <Input
                                id="title"
                                placeholder="Summer Product Launch 2024"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="campaign_type">Campaign Type *</Label>
                            <Select 
                                value={formData.campaign_type}
                                onValueChange={(value) => setFormData({...formData, campaign_type: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAMPAIGN_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Campaign Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your campaign goals, target market, and key messaging..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                        />
                    </div>

                    {/* Target Demographics */}
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Target Demographics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="age_group">Age Group *</Label>
                                    <Select 
                                        value={formData.target_age_group}
                                        onValueChange={(value) => setFormData({...formData, target_age_group: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select age group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="18-24">18-24</SelectItem>
                                            <SelectItem value="25-34">25-34</SelectItem>
                                            <SelectItem value="35-44">35-44</SelectItem>
                                            <SelectItem value="45-54">45-54</SelectItem>
                                            <SelectItem value="55-64">55-64</SelectItem>
                                            <SelectItem value="65+">65+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select 
                                        value={formData.target_demographics.gender}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            target_demographics: {...formData.target_demographics, gender: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="non-binary">Non-binary</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="income">Income Level</Label>
                                    <Select 
                                        value={formData.target_demographics.income_level}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            target_demographics: {...formData.target_demographics, income_level: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low Income</SelectItem>
                                            <SelectItem value="middle">Middle Income</SelectItem>
                                            <SelectItem value="high">High Income</SelectItem>
                                            <SelectItem value="premium">Premium/Luxury</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="interests">Target Interests</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        placeholder="e.g., fitness, technology, travel"
                                        value={currentInterest}
                                        onChange={(e) => setCurrentInterest(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                                    />
                                    <Button type="button" onClick={handleAddInterest} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                {formData.target_demographics.interests.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.target_demographics.interests.map(interest => (
                                            <Badge key={interest} variant="secondary" className="gap-1">
                                                {interest}
                                                <button onClick={() => handleRemoveInterest(interest)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keywords */}
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Keywords & Messaging
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="keywords">Main Keywords *</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        placeholder="Enter key terms and phrases"
                                        value={currentKeyword}
                                        onChange={(e) => setCurrentKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                    />
                                    <Button type="button" onClick={handleAddKeyword} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                {formData.main_keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.main_keywords.map(keyword => (
                                            <Badge key={keyword} className="bg-purple-100 text-purple-700 gap-1">
                                                {keyword}
                                                <button onClick={() => handleRemoveKeyword(keyword)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Preferences */}
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Content Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="image_style">Image Style</Label>
                                    <Select 
                                        value={formData.content_preferences.image_style}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            content_preferences: {...formData.content_preferences, image_style: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {IMAGE_STYLES.map(style => (
                                                <SelectItem key={style.value} value={style.value}>
                                                    {style.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="tone">Tone of Voice</Label>
                                    <Select 
                                        value={formData.content_preferences.tone}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            content_preferences: {...formData.content_preferences, tone: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TONES.map(tone => (
                                                <SelectItem key={tone.value} value={tone.value}>
                                                    {tone.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="color_palette">Color Palette</Label>
                                    <Select 
                                        value={formData.content_preferences.color_palette}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            content_preferences: {...formData.content_preferences, color_palette: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vibrant">Vibrant</SelectItem>
                                            <SelectItem value="muted">Muted</SelectItem>
                                            <SelectItem value="monochrome">Monochrome</SelectItem>
                                            <SelectItem value="brand_colors">Brand Colors</SelectItem>
                                            <SelectItem value="seasonal">Seasonal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="text_length">Text Length</Label>
                                    <Select 
                                        value={formData.content_preferences.text_length}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            content_preferences: {...formData.content_preferences, text_length: value}
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short_punchy">Short & Punchy</SelectItem>
                                            <SelectItem value="medium_descriptive">Medium & Descriptive</SelectItem>
                                            <SelectItem value="long_detailed">Long & Detailed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Success Metrics */}
                    <div>
                        <Label>Success Metrics</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {["clicks", "conversions", "brand_awareness", "engagement", "lead_generation", "sales"].map(metric => (
                                <button
                                    key={metric}
                                    type="button"
                                    onClick={() => handleMetricToggle(metric)}
                                    className={`p-2 rounded-lg border text-sm transition-all ${
                                        formData.success_metrics.includes(metric)
                                            ? "border-purple-300 bg-purple-50 text-purple-700"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                                    }`}
                                >
                                    {metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={() => onSubmit(formData)}
                        disabled={!canSubmit || isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        size="lg"
                    >
                        {isLoading ? "Generating Campaign Variations..." : "Generate Campaign Variations"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
