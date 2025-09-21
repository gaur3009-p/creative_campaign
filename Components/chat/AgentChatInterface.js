import React, { useState, useEffect, useRef } from "react";
import { AgentConversation } from "@/entities/AgentConversation";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, User as UserIcon, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentChatInterface({ agentName, agentTitle, systemPrompt, color }) {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [conversation, setConversation] = useState(null);
    const messagesEndRef = useRef(null);
    
    const sessionId = `${agentName.toLowerCase()}-chat`;

    useEffect(() => {
        const loadConversation = async () => {
            setIsHistoryLoading(true);
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                const conversations = await AgentConversation.filter({ session_id: sessionId, created_by: currentUser.email }, "-created_date", 1);
                if (conversations.length > 0) {
                    const sortedConversation = conversations[0];
                    sortedConversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    setConversation(sortedConversation);
                    setMessages(sortedConversation.messages);
                } else {
                    setConversation(null);
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error loading conversation:", error);
            }
            setIsHistoryLoading(false);
        };
        loadConversation();
    }, [agentName, sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage = { role: "user", content: userInput, timestamp: new Date().toISOString() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setUserInput("");
        setIsLoading(true);

        try {
            const llmResponse = await InvokeLLM({
                prompt: `${systemPrompt}\n\nConversation History:\n${updatedMessages.map(m => `${m.role}: ${m.content}`).join("\n")}\n\nNew user message: ${userMessage.content}`,
            });

            const assistantMessage = { role: "assistant", content: llmResponse, timestamp: new Date().toISOString() };
            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);

            if (conversation) {
                await AgentConversation.update(conversation.id, { messages: finalMessages });
            } else {
                const newConversation = await AgentConversation.create({
                    agent_name: agentName.toLowerCase(),
                    session_id: sessionId,
                    messages: finalMessages,
                    context: {}
                });
                setConversation(newConversation);
            }
        } catch (error) {
            console.error("Error calling LLM:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{agentName} - <span className={`text-${color}-400`}>{agentTitle}</span></h2>
            </div>

            <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
                {isHistoryLoading ? (
                    <div className="space-y-4"><Skeleton className="h-16 w-3/4 bg-white/10" /><Skeleton className="h-12 w-1/2 ml-auto bg-white/10" /></div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 pt-16">
                        <Sparkles className="w-10 h-10 mx-auto mb-4"/>
                        <p>Start a new conversation with {agentName}.</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`flex gap-4 items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'assistant' && (
                                <div className={`w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center flex-shrink-0 mt-1`}>
                                    <Sparkles className={`w-5 h-5 text-${color}-300`} />
                                </div>
                            )}
                            <div className={`max-w-xl p-4 rounded-xl ${message.role === 'user' ? 'bg-white/10 text-white' : 'bg-transparent text-gray-300'}`}>
                                <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2">{message.content}</ReactMarkdown>
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                                    <UserIcon className="w-4 h-4 text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                    <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={`Message ${agentName}...`} className="flex-1 resize-none bg-white/5 border-white/10 text-white focus:ring-orange-400" rows={1} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(e); } }}/>
                    <Button type="submit" className="btn-primary px-5 py-5" disabled={isLoading || !userInput.trim()}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
