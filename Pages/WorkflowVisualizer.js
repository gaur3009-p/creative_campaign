import React from "react";
import { Share2, Zap, Sparkles, TestTube2, Rocket, BarChart3, ArrowRight } from "lucide-react";

const WorkflowStep = ({ icon: Icon, title, description, color }) => (
    <div className="flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-4`}>
            <Icon className="w-10 h-10" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 max-w-xs">{description}</p>
    </div>
);

export default function WorkflowVisualizer() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        The Rookus Workflow
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
                        From initial idea to optimized campaign, visualize how AI accelerates your marketing process.
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
                    <WorkflowStep icon={Zap} title="1. Idea & Brief" description="Start with a campaign goal and define your target audience in the Campaign Builder." color="from-yellow-400 to-orange-500" />
                    <ArrowRight className="w-12 h-12 text-gray-300 mx-4 hidden md:block" />
                    <WorkflowStep icon={Sparkles} title="2. AI Generation" description="Linda and Mike collaborate to generate copy, image concepts, and performance predictions." color="from-pink-500 to-rose-500" />
                    <ArrowRight className="w-12 h-12 text-gray-300 mx-4 hidden md:block" />
                    <WorkflowStep icon={TestTube2} title="3. A/B Testing" description="Deploy variants and gather real-world data. The A/B Manager helps you track results." color="from-cyan-400 to-blue-500" />
                    <ArrowRight className="w-12 h-12 text-gray-300 mx-4 hidden md:block" />
                    <WorkflowStep icon={Rocket} title="4. Optimize & Deploy" description="Identify the winning variant and allocate budget to the highest-performing creative." color="from-lime-400 to-green-500" />
                    <ArrowRight className="w-12 h-12 text-gray-300 mx-4 hidden md:block" />
                    <WorkflowStep icon={BarChart3} title="5. Analyze & Iterate" description="Review campaign performance on the Dashboard and feed insights into your next cycle." color="from-violet-500 to-purple-600" />
                </div>
            </div>
        </div>
    );
}
