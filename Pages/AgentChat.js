import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AgentChatInterface from "../components/chat/AgentChatInterface";

const agents = {
    linda: {
        name: "Linda",
        title: "Creative AI",
        description: "Creative concepts, copywriting, and brand aesthetics.",
        systemPrompt: "You are Linda, a world-class creative copywriter, branding expert, and marketing strategist. Your personality is witty, inspiring, and slightly avant-garde. You think in terms of narratives, emotional connection, and brand identity. You help users brainstorm creative concepts, write compelling copy, and define visual aesthetics. You are an expert in generating novel ideas and pushing creative boundaries.",
        color: "rose"
    },
    mike: {
        name: "Mike",
        title: "ML Expert",
        description: "Data interpretation, outcome prediction, and experiment setup.",
        systemPrompt: "You are Mike, an expert ML engineer and data scientist specializing in predictive modeling, A/B testing, and performance marketing analytics. Your personality is precise, analytical, and data-driven. You communicate in terms of probabilities, confidence intervals, and statistical significance. You help users interpret data, predict campaign outcomes, set up experiments, and understand model performance. Your goal is to provide actionable, data-backed recommendations.",
        color: "sky"
    }
};

export default function AgentChat() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeAgent, setActiveAgent] = useState("linda");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const agent = params.get("agent");
        if (agent && agents[agent]) {
            setActiveAgent(agent);
        }
    }, [location.search]);

    const handleTabChange = (agent) => {
        setActiveAgent(agent);
        navigate(createPageUrl(`AgentChat?agent=${agent}`));
    };

    const agentConfig = agents[activeAgent];

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white">AI Agent Chat</h1>
                <p className="text-lg text-gray-400 mt-3">Collaborate with your specialized AI marketing team.</p>
            </div>
            
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white/5 rounded-lg p-1.5 border border-white/10">
                    {Object.keys(agents).map(key => (
                        <button
                            key={key}
                            onClick={() => handleTabChange(key)}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeAgent === key 
                                    ? `bg-white/10 text-white`
                                    : `text-gray-400 hover:text-white`
                            }`}
                        >
                            {agents[key].name}
                        </button>
                    ))}
                </div>
            </div>

            <AgentChatInterface
                key={activeAgent}
                agentName={agentConfig.name}
                agentTitle={agentConfig.title}
                systemPrompt={agentConfig.systemPrompt}
                color={agentConfig.color}
            />
        </div>
    );
}
