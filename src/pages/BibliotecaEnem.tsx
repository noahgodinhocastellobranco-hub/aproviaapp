import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Volume2, Loader2, VolumeX } from "lucide-react";
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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("professora-enem", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      const reader = data.body?.getReader();
      if (!reader) throw new Error("Sem resposta do servidor");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.content = assistantContent;
                } else {
                  newMessages.push({ role: "assistant", content: assistantContent });
                }
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setMessages((prev) => (prev.length > 20 ? prev.slice(-20) : prev));
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua pergunta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      currentAudio?.pause();
      setCurrentAudio(null);
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech-enem", {
        body: { text },
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };

      audio.play();
    } catch (error: any) {
      console.error("Erro ao gerar áudio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o áudio.",
        variant: "destructive",
      });
      setIsSpeaking(false);
    }
  };

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex flex-col">
      {/* Header com Avatar Animado */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Avatar Animado */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl transition-all duration-300 ${
                isSpeaking ? 'animate-pulse scale-110' : 'scale-100'
              }`}>
                👩‍🏫
              </div>
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                </>
              )}
            </div>

            {/* Título */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Professora ENEM
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Olá! Me pergunte qualquer dúvida que eu explico de forma simples e objetiva.
              </p>
            </div>

            {/* Indicador de Áudio */}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-primary animate-fade-in">
                <Volume2 className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium hidden md:block">Falando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-6 animate-fade-in">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
                💡
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Como posso te ajudar hoje?
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Digite sua dúvida abaixo. Posso explicar qualquer matéria do ENEM!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {["Funções quadráticas", "Probabilidade", "Interpretação de texto", "Mitocôndria"].map((exemplo) => (
                  <button
                    key={exemplo}
                    onClick={() => setInput(exemplo)}
                    className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-sm font-medium transition-all hover:scale-105"
                  >
                    {exemplo}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 animate-fade-in ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl flex-shrink-0">
                      👩‍🏫
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-primary/20"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-xl flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          {lastAssistantMessage && (
            <div className="mb-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(lastAssistantMessage.content)}
                className="gap-2 shadow-sm hover:shadow-md transition-all"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Pausar explicação
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Ouvir última explicação
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida aqui... (ex: me explique Probabilidade)"
              className="min-h-[60px] resize-none shadow-sm text-base"
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
              className="px-6 h-[60px] shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            💡 Histórico das últimas 10 conversas • Pressione Enter para enviar
          </p>
        </div>
      </div>
    </div>
  );
}
