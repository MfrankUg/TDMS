"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { handleQuery, handleTranslation } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Mic, Square } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/hooks/use-translation";

interface VoiceAssistantProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function VoiceAssistant({ isOpen, onOpenChange }: VoiceAssistantProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div");
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = useCallback(async (query: string, userName?: string) => {
    setIsLoading(true);

    let translatedQuery = query;
    if (language !== 'en') {
      const transResult = await handleTranslation({ text: query, targetLanguage: 'en' });
      translatedQuery = transResult.translatedText;
    }

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    const result = await handleQuery({ query: translatedQuery, generateAudio: true, userName });
    
    let finalAnswer = result.answer;
    let finalAudio = result.answerAudio;

    if (language !== 'en') {
      const transResult = await handleTranslation({ text: result.answer, targetLanguage: language });
      finalAnswer = transResult.translatedText;
      
      const audioResult = await handleQuery({ query: finalAnswer, generateAudio: true });
      finalAudio = audioResult.answerAudio;
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: finalAnswer,
      audioData: finalAudio,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

    if (finalAudio && audioRef.current) {
      audioRef.current.src = finalAudio;
      audioRef.current.play().catch((e) => console.error("Audio playback failed", e));
    }
  }, [language]);

  const greetUser = useCallback(async () => {
    if (user?.email) {
        const userName = user.email.split('@')[0];
        let greeting = t('voiceGreeting', { userName });

        const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: greeting,
        };
        setMessages([assistantMessage]);
        
        const utterance = new SpeechSynthesisUtterance(greeting);
        utterance.lang = language;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            toggleRecording(true); // Start recording after greeting
        };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }
  }, [user, language, t]);


  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      greetUser();
    } else {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsSpeaking(false);
    }
  }, [isOpen, greetUser]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        processQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    }

    return () => {
      window.speechSynthesis.cancel();
    }
  }, [processQuery, language]);

  const toggleRecording = (forceStart = false) => {
    if (isRecording && !forceStart) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(forceStart || !isRecording);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('voiceAssistant')}</DialogTitle>
          <DialogDescription>
            {t('voiceAssistantDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
           <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
             <div className="space-y-4">
               {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                     <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
               ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                        <div className="flex items-center justify-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-foreground animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 rounded-full bg-foreground animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 rounded-full bg-foreground animate-pulse"></span>
                        </div>
                    </div>
                  </div>
                )}
             </div>
           </ScrollArea>
        </div>
         <div className="flex justify-center items-center pt-4">
          <Button
            type="button"
            onClick={() => toggleRecording()}
            disabled={isLoading || isSpeaking}
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            className="w-16 h-16 rounded-full"
          >
            {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </div>
        <audio ref={audioRef} className="hidden" onPlay={() => setIsSpeaking(true)} onEnded={() => setIsSpeaking(false)} />
      </DialogContent>
    </Dialog>
  );
}
