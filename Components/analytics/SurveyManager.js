import React, { useState, useEffect } from 'react';
import { SurveyRequest } from "@/entities/all";
import { SendEmail } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Users, Send, CheckCircle, Mail, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SurveyManager({ campaign, onSurveyCreated }) {
    const [surveys, setSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSurvey, setNewSurvey] = useState({ title: `Feedback for ${campaign.name}`, emails: [], instructions: `Please provide your honest feedback on the campaign: "${campaign.name}". Your insights on its appeal, clarity, and overall effectiveness are highly valuable.` });
    const [emailInput, setEmailInput] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    useEffect(() => {
        SurveyRequest.filter({ campaign_id: campaign.id }, "-created_date").then(setSurveys);
    }, [campaign.id]);

    const handleAddEmail = () => {
        if (emailInput && !newSurvey.emails.includes(emailInput)) {
            setNewSurvey(prev => ({ ...prev, emails: [...prev.emails, emailInput] }));
            setEmailInput("");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setNewSurvey(prev => ({ ...prev, emails: prev.emails.filter(email => email !== emailToRemove) }));
    };

    const handleSendSurvey = async () => {
        if (newSurvey.emails.length === 0) {
            setError("Please add at least one recipient email.");
            return;
        }
        setError("");
        setIsLoading(true);
        setSent(false);

        try {
            const surveyRecord = await SurveyRequest.create({
                campaign_id: campaign.id,
                survey_title: newSurvey.title,
                recipient_emails: newSurvey.emails,
                survey_instructions: newSurvey.instructions,
                sent_timestamp: new Date().toISOString(),
                status: "sent"
            });

            const emailBody = `
                <h2>${newSurvey.title}</h2>
                <p>${newSurvey.instructions}</p>
                <p>Please reply to this email with your feedback.</p>
                <hr>
                <h3>Campaign Details:</h3>
                <p><strong>Name:</strong> ${campaign.name}</p>
                <p><strong>Description:</strong> ${campaign.description}</p>
                <p><strong>Target Audience:</strong> ${campaign.target_audience}</p>
            `;

            const emailPromises = newSurvey.emails.map(email =>
                SendEmail({
                    to: email,
                    subject: newSurvey.title,
                    body: emailBody,
                    from_name: "Rookus AI Feedback"
                })
            );
            await Promise.all(emailPromises);

            onSurveyCreated(surveyRecord);
            setSurveys(prev => [surveyRecord, ...prev]);
            setNewSurvey({ title: `Feedback for ${campaign.name}`, emails: [], instructions: `Please provide your honest feedback on the campaign: "${campaign.name}". Your insights on its appeal, clarity, and overall effectiveness are highly valuable.` });
            setSent(true);

        } catch (err) {
            console.error("Failed to send survey:", err);
            setError("Failed to send survey. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-orange-400"/>Human Survey Management</h3>
                <p className="text-gray-400">Send this campaign to colleagues or a focus group for qualitative feedback.</p>
            </div>

            <div className="space-y-4">
                <Label htmlFor="surveyTitle">Survey Title</Label>
                <Input id="surveyTitle" className="bg-white/5 border-white/10 text-white" value={newSurvey.title} onChange={e => setNewSurvey({...newSurvey, title: e.target.value})} />
            </div>

            <div className="space-y-4">
                <Label htmlFor="surveyInstructions">Instructions</Label>
                <Textarea id="surveyInstructions" className="bg-white/5 border-white/10 text-white h-24" value={newSurvey.instructions} onChange={e => setNewSurvey({...newSurvey, instructions: e.target.value})} />
            </div>

            <div className="space-y-4">
                <Label htmlFor="recipientEmails">Recipient Emails</Label>
                <div className="flex gap-2">
                    <Input id="recipientEmails" type="email" placeholder="Add an email and press Enter" className="bg-white/5 border-white/10 text-white" value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => {if(e.key === 'Enter'){e.preventDefault(); handleAddEmail()}}} />
                    <Button onClick={handleAddEmail} className="btn-secondary">Add</Button>
                </div>
                {newSurvey.emails.length > 0 &&
                    <div className="flex flex-wrap gap-2 mt-2">
                        {newSurvey.emails.map(email => (
                            <Badge key={email} className="bg-gray-700 text-gray-200">
                                {email}
                                <button onClick={() => handleRemoveEmail(email)} className="ml-2 hover:text-white"><X className="w-3 h-3"/></button>
                            </Badge>
                        ))}
                    </div>
                }
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {sent && <p className="text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4"/>Survey sent successfully!</p>}

            <Button onClick={handleSendSurvey} disabled={isLoading || newSurvey.emails.length === 0} className="w-full btn-primary py-6 text-base gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>}
                Send Survey to {newSurvey.emails.length} recipient{newSurvey.emails.length !== 1 ? 's' : ''}
            </Button>
            
            {surveys.length > 0 && (
                <div className="border-t border-white/10 pt-8">
                     <h4 className="text-lg font-bold text-white mb-4">Sent Surveys</h4>
                     <div className="space-y-3">
                        {surveys.map(survey => (
                            <div key={survey.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <p className="font-semibold text-white">{survey.survey_title}</p>
                                <p className="text-sm text-gray-400">Sent to {survey.recipient_emails.length} recipients on {new Date(survey.sent_timestamp).toLocaleDateString()}</p>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
}
