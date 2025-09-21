import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, FileText, BrainCircuit, Activity } from "lucide-react";

const models = [
    {
        name: "Linda - Creative Agent",
        version: "v2.3",
        status: "Active",
        description: "Large language model fine-tuned for creative copywriting, branding, and marketing strategy. Powered by a GPT-4 class foundation.",
        color: "from-pink-500 to-rose-500",
        icon: BrainCircuit,
    },
    {
        name: "Mike - ML Agent",
        version: "v1.8",
        status: "Active",
        description: "Specialized agent for data analysis, performance prediction, and experimental design. Utilizes a suite of predictive models.",
        color: "from-blue-500 to-indigo-500",
        icon: BrainCircuit,
    },
    {
        name: "CTR Prediction Model",
        version: "v1.2 (LightGBM)",
        status: "Active",
        description: "Gradient boosting model trained on historical campaign data to predict click-through rates for new ad variants.",
        color: "from-green-500 to-emerald-500",
        icon: FileText,
    }
];

const activityLog = [
    { timestamp: "2024-08-15 10:30 AM", event: "Deployed Linda v2.3: Enhanced narrative generation capabilities." },
    { timestamp: "2024-08-12 04:00 PM", event: "Retrained CTR Prediction Model with new impression data." },
    { timestamp: "2024-08-10 09:00 AM", event: "Updated Mike v1.8: Improved confidence interval calculations." },
];

const ModelCard = ({ model }) => (
    <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white`}>
                        <model.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">{model.name}</CardTitle>
                        <p className="text-sm text-gray-500">{model.version}</p>
                    </div>
                </div>
                <Badge className={model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{model.status}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600">{model.description}</p>
        </CardContent>
    </Card>
);

export default function ModelOps() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Model Operations
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        An overview of the AI models powering the Rookus platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map(model => <ModelCard key={model.name} model={model} />)}
                </div>

                <Card className="glass-card border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activityLog.map((log, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <p className="text-sm text-gray-400 whitespace-nowrap">{log.timestamp}</p>
                                    <div className="w-px h-full bg-gray-200" />
                                    <p className="text-sm text-gray-700">{log.event}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
