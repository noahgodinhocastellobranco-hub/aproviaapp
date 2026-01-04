import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Volume2, Loader2, VolumeX, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function BibliotecaEnem() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMessage];
    
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/professora-enem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: allMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Sem resposta do servidor");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (!trimmedLine || trimmedLine.startsWith(":")) continue;
          if (!trimmedLine.startsWith("data: ")) continue;

          const jsonStr = trimmedLine.slice(6);
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                
                if (lastMsg?.role === "assistant") {
                  return newMessages.map((m, i) =>
                    i === newMessages.length - 1
                      ? { ...m, content: assistantContent }
                      : m
                  );
                }
                return [...newMessages, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      // Keep only last 20 messages
      setMessages((prev) => (prev.length > 20 ? prev.slice(-20) : prev));
      
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua pergunta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const handleSpeak = async (text: string) => {
    // If already speaking, stop
    if (isSpeaking) {
      stopAudio();
      return;
    }

    setIsGeneratingAudio(true);

    try {
      // Limit text length for TTS
      const limitedText = text.length > 2000 ? text.slice(0, 2000) + "..." : text;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech-enem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: limitedText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao gerar áudio");
      }

      const data = await response.json();

      if (!data.audioContent) {
        throw new Error("Áudio não recebido");
      }

      // Create and play audio
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        toast({
          title: "Erro",
          description: "Erro ao reproduzir áudio",
          variant: "destructive",
        });
      };

      await audio.play();
      
    } catch (error: any) {
      console.error("Erro TTS:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o áudio.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const lastAssistantMessage = messages.filter(m => m.role === "assistant").pop();

  const exampleQuestions = [
    "Me explique regra de três",
    "O que é mitose?",
    "Como fazer uma boa redação?",
    "Explique a Segunda Guerra Mundial",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 ${
                  isSpeaking ? "scale-110 animate-pulse" : ""
                }`}
              >
                👩‍🏫
              </div>
              {isSpeaking && (
                <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                Professora ENEM
                <Sparkles className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Tire suas dúvidas e ouça as explicações em áudio!
              </p>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-2 text-primary">
                <Volume2 className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium hidden sm:block">Falando...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl">
                💡
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Como posso te ajudar?</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Pergunte qualquer coisa sobre as matérias do ENEM. Eu explico e você pode ouvir em áudio!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {exampleQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-lg flex-shrink-0">
                      👩‍🏫
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t bg-background/90 backdrop-blur-sm sticky bottom-0">
        <div className="container max-w-3xl mx-auto px-4 py-4 space-y-3">
          {/* Audio Button */}
          {lastAssistantMessage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(lastAssistantMessage.content)}
                disabled={isGeneratingAudio}
                className="gap-2"
              >
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando áudio...
                  </>
                ) : isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Parar áudio
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Ouvir explicação
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="min-h-[50px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-[50px] px-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Pressione Enter para enviar • Shift+Enter para nova linha
          </p>
        </div>
      </footer>
    </div>
  );
}
