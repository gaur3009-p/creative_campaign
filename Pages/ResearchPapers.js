import React, { useState, useEffect } from "react";
import { ResearchPaper } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Plus, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const PaperCard = ({ paper }) => (
    <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {paper.title}
                </CardTitle>
                <Badge className={`border ${paper.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {paper.status}
                </Badge>
            </div>
            <p className="text-sm text-gray-500 pt-1">
                By {paper.authors?.join(", ") || "Anonymous"} on {format(new Date(paper.created_date), "MMM d, yyyy")}
            </p>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{paper.abstract}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {paper.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-purple-50 text-purple-700">{tag}</Badge>
                ))}
            </div>
            <Link to={createPageUrl(`ViewResearchPaper?id=${paper.id}`)}>
                <Button variant="outline" className="w-full gap-2 hover:bg-purple-50 hover:border-purple-200">
                    Read Paper <ArrowUpRight className="w-4 h-4" />
                </Button>
            </Link>
        </CardContent>
    </Card>
);

export default function ResearchPapers() {
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPapers = async () => {
            setIsLoading(true);
            try {
                const data = await ResearchPaper.list("-created_date");
                setPapers(data);
            } catch (error) {
                console.error("Error loading research papers:", error);
            }
            setIsLoading(false);
        };
        loadPapers();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Research Library
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Insights and experiments from our ML team
                        </p>
                    </div>
                    {/* Placeholder for future "New Paper" button */}
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Card key={i} className="glass-card border-0 shadow-lg">
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2 mt-2" />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-10 w-full mt-4" />
                                </CardContent>
                            </Card>
                        ))
                    ) : papers.length > 0 ? (
                        papers.map(paper => <PaperCard key={paper.id} paper={paper} />)
                    ) : (
                         <div className="col-span-full text-center py-20">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-500">No Research Papers Found</h3>
                            <p className="text-gray-400 mt-2">Check back later for new insights and publications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
