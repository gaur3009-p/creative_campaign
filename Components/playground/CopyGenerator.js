import React, { useState } from 'react';
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CopyGenerator() {
    const [prompt, setPrompt] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setResults([]);
        try {
            const response = await InvokeLLM({
                prompt: `You are Linda, a world-class creative copywriter. Based on the following brief, generate 3 distinct copy variations (headline and body). Make them engaging and creative.\n\nBrief: "${prompt}"`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        variations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    headline: { type: "string" },
                                    body: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setResults(response.variations || []);
        } catch (error) {
            console.error("Error generating copy:", error);
            // You can set an error state here
        }
        setIsLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="glass-card border-0 shadow-lg sticky top-6">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-600" /> Your Brief</h3>
                        <Textarea
                            placeholder="e.g., 'A campaign for a new brand of eco-friendly sneakers made from recycled ocean plastic...'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="h-48"
                        />
                        <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Copy
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                {isLoading && Array(3).fill(0).map((_, i) => (
                    <Card key={i}><CardContent className="p-4"><Skeleton className="h-24" /></CardContent></Card>
                ))}
                {results.map((result, index) => (
                    <Card key={index} className="glass-card border-0 shadow-lg animate-in fade-in-50">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-lg text-gray-900 mb-2">{result.headline}</h4>
                            <p className="text-gray-700">{result.body}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
