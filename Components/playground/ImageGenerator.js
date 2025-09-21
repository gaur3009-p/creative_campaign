import React, { useState } from 'react';
import { GenerateImage } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageGenerator({ onImageGenerated }) {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setImageUrl("");
        try {
            const response = await GenerateImage({ prompt });
            setImageUrl(response.url);
            
            // Notify parent component about the generated image
            if (onImageGenerated) {
                onImageGenerated(response.url, prompt);
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="glass-card border-0 shadow-lg sticky top-6">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" /> 
                            Your Prompt
                        </h3>
                        <Textarea
                            placeholder="e.g., 'A vibrant, photorealistic image of eco-friendly sneakers on a pristine beach at sunrise...'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="h-48"
                        />
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !prompt.trim()} 
                            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Poster
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="glass-card border-0 shadow-lg aspect-square">
                    <CardContent className="p-6 h-full flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-center text-gray-500 space-y-2">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                                <p>Generating poster with CTA... this can take a moment.</p>
                            </div>
                        ) : imageUrl ? (
                            <img src={imageUrl} alt={prompt} className="rounded-lg object-contain max-h-full max-w-full" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                                <p>Your generated poster will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
