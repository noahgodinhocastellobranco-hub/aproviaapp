import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Send,
  ImagePlus,
  X,
  BookOpen,
  Calendar,
  FileText,
  Lightbulb,
  Target,
  Brain,
  PenLine,
  ListChecks,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import FormattedText from "@/components/FormattedText";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  images?: string[];
};

const QUICK_ACTIONS = [
  {
    icon: Calendar,
    label: "Plano de estudos",
    prompt:
      "Crie um plano de estudos personalizado e detalhado para o ENEM, distribuindo as matérias ao longo da semana com dicas práticas.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: FileText,
    label: "Resumir conteúdo",
    prompt:
      "Faça um resumo completo, didático e organizado sobre o conteúdo enviado (texto ou foto). Use tópicos, exemplos e destaque o que mais cai no ENEM.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: ListChecks,
    label: "Criar questões",
    prompt:
      "Gere 5 questões estilo ENEM sobre a matéria/foto enviada, com alternativas A-E e gabarito comentado ao final.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: PenLine,
    label: "Tema de redação",
    prompt:
      "Me sugira 3 temas atuais e relevantes de redação estilo ENEM, com repertórios socioculturais, argumentos e possíveis propostas de intervenção.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Lightbulb,
    label: "Explicar matéria",
    prompt:
      "Explique de forma simples, didática e com exemplos a matéria que enviei (texto ou foto). Como se eu fosse iniciante no assunto.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Target,
    label: "Dicas para o ENEM",
    prompt:
      "Me passe as melhores dicas, estratégias e macetes para arrasar no ENEM 2026, considerando tempo de prova, TRI e correção.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: BookOpen,
    label: "Corrigir exercício",
    prompt:
      "Corrija o exercício que enviei (na foto ou texto), explicando passo a passo o raciocínio correto e onde eu poderia errar.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Brain,
    label: "Mapa mental",
    prompt:
      "Crie um mapa mental textual bem organizado do conteúdo enviado, com tópicos principais, subtópicos e conexões entre ideias.",
    color: "from-violet-500 to-purple-500",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-aprovia`;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("nome, email").eq("id", user.id).maybeSingle();
      const nome = (data?.nome || data?.email || user.email || "").trim();
      setUserName(nome.split(" ")[0] || nome.split("@")[0] || "");
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, 4 - images.length);
    for (const f of list) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 8 * 1024 * 1024) {
        toast({ title: "Imagem muito grande", description: "Máx 8MB", variant: "destructive" });
        continue;
      }
      const b64 = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      });
      setImages((prev) => [...prev, b64]);
    }
  };

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if ((!text && images.length === 0) || loading) return;

    const userMsg: Message = { role: "user", content: text || "(imagem enviada)", images: [...images] };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    const sentImages = [...images];
    setImages([]);
    setLoading(true);

    try {
      // Build API messages with multimodal content when images are present
      const apiMessages = nextHistory.map((m) => {
        if (m.images && m.images.length > 0) {
          return {
            role: m.role,
            content: [
              { type: "text", text: m.content },
              ...m.images.map((url) => ({ type: "image_url", image_url: { url } })),
            ],
          };
        }
        return { role: m.role, content: m.content };
      });

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Erro ao conectar");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      let acc = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let i: number;
        while ((i = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, i);
          buf = buf.slice(i + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setMessages((prev) => {
                const u = [...prev];
                u[u.length - 1] = { role: "assistant", content: acc };
                return u;
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      void sentImages;
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6 max-w-5xl flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AprovI.A
              </h1>
              <p className="text-sm text-muted-foreground">Sua tutora inteligente para o ENEM • responde textos e fotos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => {
                  setMessages([]);
                  setImages([]);
                  setInput("");
                  toast({ title: "Chat limpo", description: "Sua conversa foi apagada." });
                }}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Limpar chat</span>
              </Button>
            )}
            {userName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card border border-border/60 shadow-sm">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-sm font-bold">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold hidden sm:inline">{userName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col">
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="px-4 md:px-8 py-6 space-y-6">
              {isEmpty && (
                <div className="text-center py-6 space-y-6 animate-fade-in">
                  <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Como posso te ajudar hoje?</h2>
                    <p className="text-muted-foreground mt-2">
                      Escolha uma opção abaixo ou envie sua pergunta com foto 📸
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
                    {QUICK_ACTIONS.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => {
                          setInput(a.prompt);
                          setTimeout(() => {
                            const ta = document.querySelector<HTMLTextAreaElement>("textarea");
                            ta?.focus();
                          }, 50);
                        }}
                        className="group relative p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all hover:-translate-y-0.5 hover:shadow-lg text-left"
                      >
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-sm", a.color)}>
                          <a.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-semibold leading-tight">{a.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3 animate-fade-in", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <Avatar className="h-9 w-9 shrink-0 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xs font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] shadow-sm",
                      m.role === "user"
                        ? "bg-gradient-to-br from-primary to-blue-600 text-white"
                        : "bg-muted/60 border border-border/50"
                    )}
                  >
                    {m.images && m.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {m.images.map((img, k) => (
                          <img key={k} src={img} alt="anexo" className="rounded-lg max-h-48 object-cover" />
                        ))}
                      </div>
                    )}
                    {m.role === "assistant" ? (
                      <FormattedText text={m.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 animate-fade-in">
                  <Avatar className="h-9 w-9 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xs font-bold">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/50">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm p-3 md:p-4">
            {images.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="preview" className="h-20 w-20 rounded-xl object-cover border border-border" />
                    <button
                      onClick={() => setImages((p) => p.filter((_, k) => k !== i))}
                      className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl"
                onClick={() => fileRef.current?.click()}
                disabled={loading || images.length >= 4}
                title="Anexar foto"
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Pergunte qualquer coisa ou envie uma foto..."
                disabled={loading}
                rows={1}
                className="flex-1 resize-none rounded-xl min-h-[44px] max-h-40"
              />
              <Button
                onClick={() => send()}
                disabled={loading || (!input.trim() && images.length === 0)}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-blue-600 hover:opacity-90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 Dica: envie fotos de exercícios, matéria ou resumos para a AprovI.A analisar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
