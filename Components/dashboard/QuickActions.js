import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, Palette, BarChart3, Cpu, ArrowRight } from "lucide-react";

const actions = [
    {
        title: "Chat with Linda",
        description: "Creative AI Assistant",
        icon: MessageSquare,
        href: createPageUrl("AgentChat") + "?agent=linda",
        color: "text-pink-600 bg-pink-100"
    },
    {
        title: "Chat with Mike", 
        description: "ML Performance Expert",
        icon: MessageSquare,
        href: createPageUrl("AgentChat") + "?agent=mike", 
        color: "text-blue-600 bg-blue-100"
    },
    {
        title: "Creative Lab",
        description: "Generate content",
        icon: Palette,
        href: createPageUrl("CreativePlayground"),
        color: "text-purple-600 bg-purple-100"
    },
    {
        title: "A/B Testing",
        description: "Optimize variants",
        icon: BarChart3,
        href: createPageUrl("ABManager"),
        color: "text-green-600 bg-green-100"
    }
];

export default function QuickActions() {
    return (
        <Card className="card-shadow border-0">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {actions.map((action, index) => (
                    <Link key={index} to={action.href}>
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto hover:bg-gray-50 group rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${action.color}`}>
                                    <action.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                                    <div className="text-xs text-gray-500">{action.description}</div>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
