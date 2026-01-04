import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Remove markdown formatting from text
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s/gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/>\s?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export default function ProfessoraVirtual() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech synthesis and load voices
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      synthRef.current?.getVoices();
    };
    
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "pt-BR";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== "aborted") {
          toast({
            title: "Erro no microfone",
            description: "Não foi possível capturar o áudio.",
            variant: "destructive",
          });
        }
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [toast]);

  const speak = useCallback((text: string) => {
    if (isMuted || !text || !synthRef.current) return;

    synthRef.current.cancel();
    setIsPaused(false);

    const cleanText = cleanMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "pt-BR";
    utterance.rate = 1.15; // Faster speech
    utterance.pitch = 1.1; // Slightly higher for feminine voice
    utterance.volume = volume / 100;

    const voices = synthRef.current.getVoices();
    
    // Priority order for best Brazilian Portuguese female voices
    const voicePriority = [
      "Google português do Brasil", // Best quality on Chrome
      "Luciana", // Microsoft Edge
      "Francisca", // Apple devices
      "Vitoria", // Some systems
      "Maria", // Fallback
      "pt-BR", // Any Portuguese Brazilian
      "pt", // Any Portuguese
    ];

    let selectedVoice = null;
    
    // First try to find the best quality voice
    for (const priority of voicePriority) {
      const found = voices.find(v => 
        v.name.toLowerCase().includes(priority.toLowerCase()) &&
        (v.lang === "pt-BR" || v.lang === "pt_BR" || v.lang.startsWith("pt"))
      );
      if (found) {
        selectedVoice = found;
        break;
      }
    }
    
    // If no preferred voice found, get any pt-BR voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === "pt-BR" || v.lang === "pt_BR") 
        || voices.find(v => v.lang.startsWith("pt"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using voice:", selectedVoice.name);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [volume, isMuted]);

  const togglePause = useCallback(() => {
    if (!synthRef.current) return;
    
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      synthRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  }, [isPaused]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta reconhecimento de voz.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, stopSpeaking, toast]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMessage];
    
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);
    stopSpeaking();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/professora-virtual`,
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

      if (!response.body) throw new Error("Sem resposta");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":") || !trimmed.startsWith("data: ")) continue;

          const jsonStr = trimmed.slice(6);
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      if (assistantContent) {
        speak(assistantContent);
      }

      setMessages((prev) => (prev.length > 20 ? prev.slice(-20) : prev));
      
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua pergunta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      stopSpeaking();
      setIsMuted(true);
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col items-center justify-between p-4 md:p-8">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Professora Virtual</h1>
        <p className="text-sm text-muted-foreground mt-1">Sua ajuda para o ENEM</p>
      </div>

      {/* Main Content - Orb */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md py-8">
        {/* Animated Orb */}
        <div className="relative mb-8">
          {/* Outer glow rings */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary/20 animate-pulse" />
            </>
          )}
          {isListening && (
            <>
              <div className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 rounded-full bg-red-500/20 animate-pulse" />
            </>
          )}
          
          {/* Main orb */}
          <div 
            className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-500 ${
              isSpeaking 
                ? "bg-gradient-to-br from-primary via-primary/80 to-primary/60 scale-110 shadow-2xl shadow-primary/50" 
                : isListening
                ? "bg-gradient-to-br from-red-500 via-red-400 to-red-300 scale-105 shadow-2xl shadow-red-500/50"
                : isLoading
                ? "bg-gradient-to-br from-muted via-muted/80 to-muted/60 animate-pulse"
                : isPaused
                ? "bg-gradient-to-br from-amber-500 via-amber-400 to-amber-300 shadow-xl shadow-amber-500/30"
                : "bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40 hover:scale-105"
            }`}
          >
            {/* Inner circle */}
            <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
              isSpeaking ? "scale-95" : "scale-100"
            }`}>
              {isLoading ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : isSpeaking ? (
                <div className="flex gap-1.5 items-end">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 bg-white rounded-full animate-pulse"
                      style={{
                        height: `${20 + i * 8}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              ) : isPaused ? (
                <Play className="w-12 h-12 text-white" />
              ) : isListening ? (
                <Mic className="w-12 h-12 text-white animate-pulse" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/30" />
              )}
            </div>
          </div>
        </div>

        {/* Status text */}
        <p className="text-sm text-muted-foreground mb-4 h-5">
          {isLoading && "Pensando..."}
          {isSpeaking && "Falando..."}
          {isPaused && "Pausado - clique para continuar"}
          {isListening && "Ouvindo..."}
          {!isLoading && !isSpeaking && !isPaused && !isListening && lastMessage?.role === "assistant" && "Toque no círculo para ouvir novamente"}
        </p>

        {/* Last message preview - summary */}
        {lastMessage?.role === "assistant" && (
          <div 
            className="w-full max-w-md bg-muted/50 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => speak(lastMessage.content)}
          >
            <p className="text-xs text-muted-foreground mb-1">Resumo:</p>
            <p className="text-sm leading-relaxed line-clamp-4">
              {cleanMarkdown(lastMessage.content).length > 200 
                ? cleanMarkdown(lastMessage.content).substring(0, 200) + "..." 
                : cleanMarkdown(lastMessage.content)}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md space-y-4 pb-4">
        {/* Input Area */}
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleListening}
            disabled={isLoading}
            className="flex-shrink-0 h-12 w-12"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="h-12 text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading || isListening}
          />
          
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="flex-shrink-0 h-12 w-12"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="flex-shrink-0 h-8 w-8"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-muted-foreground" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={(value) => {
              setVolume(value[0]);
              if (value[0] > 0) setIsMuted(false);
            }}
            max={100}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
          
          <span className="text-xs text-muted-foreground w-8 text-right">
            {isMuted ? 0 : volume}%
          </span>
        </div>

        {/* Pause/Resume and Stop buttons */}
        {(isSpeaking || isPaused) && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={togglePause}
              className="flex-1"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Continuar
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={stopSpeaking}
              className="flex-1"
            >
              Parar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
