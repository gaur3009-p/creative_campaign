import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Download, Palette, Type, Move } from "lucide-react";

export default function PosterEditor({ poster, onSave, onCTAUpdate }) {
    const [ctaText, setCTAText] = useState(poster?.cta_text || "");
    const [ctaStyle, setCTAStyle] = useState(poster?.cta_style || {
        background_color: "#7c3aed",
        text_color: "#ffffff",
        font_size: "18px",
        border_radius: "8px",
        padding: "12px 24px"
    });
    const [ctaPosition, setCTAPosition] = useState(poster?.cta_position || {
        x: 50,
        y: 80,
        width: 200,
        height: 50
    });
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef(null);

    const handleCTAChange = (field, value) => {
        const newStyle = { ...ctaStyle, [field]: value };
        setCTAStyle(newStyle);
        if (onCTAUpdate) {
            onCTAUpdate({
                text: ctaText,
                style: newStyle,
                position: ctaPosition
            });
        }
    };

    const handlePositionChange = (field, value) => {
        const newPosition = { ...ctaPosition, [field]: parseInt(value) };
        setCTAPosition(newPosition);
        if (onCTAUpdate) {
            onCTAUpdate({
                text: ctaText,
                style: ctaStyle,
                position: newPosition
            });
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                ...poster,
                cta_text: ctaText,
                cta_style: ctaStyle,
                cta_position: ctaPosition
            });
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Poster Preview */}
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Poster Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                            {poster?.image_url && (
                                <img 
                                    src={poster.image_url} 
                                    alt="Generated Poster"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            
                            {/* CTA Overlay */}
                            <div
                                className="absolute cursor-move select-none flex items-center justify-center text-center font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                                style={{
                                    left: `${ctaPosition.x}%`,
                                    top: `${ctaPosition.y}%`,
                                    width: `${ctaPosition.width}px`,
                                    height: `${ctaPosition.height}px`,
                                    backgroundColor: ctaStyle.background_color,
                                    color: ctaStyle.text_color,
                                    fontSize: ctaStyle.font_size,
                                    borderRadius: ctaStyle.border_radius,
                                    padding: ctaStyle.padding,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {ctaText || "Your CTA Here"}
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleSave} className="flex-1">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Editor Controls */}
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="w-5 h-5" />
                            CTA Editor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="cta-text">CTA Text</Label>
                            <Input
                                id="cta-text"
                                value={ctaText}
                                onChange={(e) => setCTAText(e.target.value)}
                                placeholder="Get Started Now"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="bg-color">Background</Label>
                                <Input
                                    id="bg-color"
                                    type="color"
                                    value={ctaStyle.background_color}
                                    onChange={(e) => handleCTAChange('background_color', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="text-color">Text Color</Label>
                                <Input
                                    id="text-color"
                                    type="color"
                                    value={ctaStyle.text_color}
                                    onChange={(e) => handleCTAChange('text_color', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="font-size">Font Size</Label>
                            <Select 
                                value={ctaStyle.font_size}
                                onValueChange={(value) => handleCTAChange('font_size', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="14px">Small (14px)</SelectItem>
                                    <SelectItem value="16px">Medium (16px)</SelectItem>
                                    <SelectItem value="18px">Large (18px)</SelectItem>
                                    <SelectItem value="24px">X-Large (24px)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="border-radius">Border Radius</Label>
                            <Select 
                                value={ctaStyle.border_radius}
                                onValueChange={(value) => handleCTAChange('border_radius', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0px">None</SelectItem>
                                    <SelectItem value="4px">Small</SelectItem>
                                    <SelectItem value="8px">Medium</SelectItem>
                                    <SelectItem value="16px">Large</SelectItem>
                                    <SelectItem value="50px">Pill</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Move className="w-5 h-5" />
                            Position Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="pos-x">X Position (%)</Label>
                                <Input
                                    id="pos-x"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={ctaPosition.x}
                                    onChange={(e) => handlePositionChange('x', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pos-y">Y Position (%)</Label>
                                <Input
                                    id="pos-y"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={ctaPosition.y}
                                    onChange={(e) => handlePositionChange('y', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cta-width">Width (px)</Label>
                                <Input
                                    id="cta-width"
                                    type="number"
                                    min="100"
                                    max="400"
                                    value={ctaPosition.width}
                                    onChange={(e) => handlePositionChange('width', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cta-height">Height (px)</Label>
                                <Input
                                    id="cta-height"
                                    type="number"
                                    min="30"
                                    max="100"
                                    value={ctaPosition.height}
                                    onChange={(e) => handlePositionChange('height', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
