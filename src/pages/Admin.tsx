import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Bell, Crown, DollarSign, Eye, Shield, Trash2, UserCog, Users, Zap } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Venda = Tables<"vendas">;
const OWNER_EMAIL = "noahgodinhocastellobranco@gmail.com";

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [notification, setNotification] = useState({ titulo: "", mensagem: "", tipo: "info" });

  const requireAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    return !!data;
  };

  const load = async () => {
    if (!(await requireAdmin())) {
      toast.error("Acesso restrito aos administradores.");
      navigate("/dashboard", { replace: true });
      return;
    }
    const [{ data: profiles }, { data: sales }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("vendas").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setUsers(profiles || []);
    setVendas(sales || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    users: users.length,
    pros: users.filter((u) => u.is_premium).length,
    receita: vendas.reduce((sum, v) => sum + (v.valor || 0), 0),
    eventos: vendas.length,
  }), [users, vendas]);

  const togglePro = async (user: Profile, value: boolean) => {
    if (user.email?.toLowerCase() === OWNER_EMAIL && !value) {
      toast.error("A conta do proprietário não pode perder o PRO.");
      return;
    }
    const { error } = await supabase.from("profiles").update({ is_premium: value }).eq("id", user.id);
    if (error) toast.error("Não foi possível alterar o PRO.");
    else { toast.success(value ? "PRO liberado." : "PRO removido."); load(); }
  };

  const grantByEmail = async () => {
    const { error } = await supabase.from("profiles").update({ is_premium: true, email_verified: true }).eq("email", newEmail.trim().toLowerCase());
    if (error) toast.error("Não foi possível liberar PRO.");
    else { toast.success("PRO liberado para o email."); setNewEmail(""); load(); }
  };

  const deleteUser = async (user: Profile) => {
    if (user.email?.toLowerCase() === OWNER_EMAIL) {
      toast.error("A conta do proprietário é protegida.");
      return;
    }
    if (!confirm(`Excluir totalmente ${user.email}? Essa pessoa poderá criar conta novamente com o mesmo email.`)) return;
    const { error } = await supabase.functions.invoke("admin-delete-user", { body: { userId: user.id, email: user.email } });
    if (error) toast.error("Não foi possível excluir a conta.");
    else { toast.success("Conta excluída totalmente."); load(); }
  };

  const createNotification = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("admin_notifications").insert({ ...notification, created_by: user?.id, ativo: true });
    if (error) toast.error("Não foi possível enviar o aviso.");
    else { toast.success("Aviso global enviado."); setNotification({ titulo: "", mensagem: "", tipo: "info" }); }
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-primary font-semibold">Carregando modo administração...</div>;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-2"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
            <h1 className="text-4xl font-black text-foreground">Painel de Administração</h1>
            <p className="text-muted-foreground">Controle total de usuários, PRO, vendas, avisos e acessos.</p>
          </div>
          <Button onClick={() => navigate("/vendas")}><Eye className="mr-2 h-4 w-4" /> Ver Vendas</Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card><CardContent className="p-5"><Users className="mb-2 h-5 w-5 text-primary" /><p className="text-sm text-muted-foreground">Usuários</p><p className="text-3xl font-black">{stats.users}</p></CardContent></Card>
          <Card><CardContent className="p-5"><Crown className="mb-2 h-5 w-5 text-success" /><p className="text-sm text-muted-foreground">PRO ativos</p><p className="text-3xl font-black">{stats.pros}</p></CardContent></Card>
          <Card><CardContent className="p-5"><DollarSign className="mb-2 h-5 w-5 text-success" /><p className="text-sm text-muted-foreground">Valor bruto</p><p className="text-3xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.receita / 100)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><Zap className="mb-2 h-5 w-5 text-primary" /><p className="text-sm text-muted-foreground">Eventos Cakto</p><p className="text-3xl font-black">{stats.eventos}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="usuarios">
          <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="usuarios">Usuários</TabsTrigger><TabsTrigger value="vendas">Cakto</TabsTrigger><TabsTrigger value="avisos">Avisos</TabsTrigger></TabsList>
          <TabsContent value="usuarios" className="mt-5 space-y-5">
            <Card><CardContent className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]"><div><Label>Liberar PRO grátis por email</Label><Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@exemplo.com" /></div><Button className="self-end" onClick={grantByEmail}><Crown className="mr-2 h-4 w-4" /> Liberar PRO</Button></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserCog className="h-5 w-5 text-primary" /> Gestão de usuários</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader><TableBody>{users.map((user) => <TableRow key={user.id}><TableCell>{user.nome || "—"}</TableCell><TableCell>{user.email}</TableCell><TableCell><div className="flex gap-2"><Badge variant={user.is_premium ? "default" : "outline"}>{user.is_premium ? "PRO" : "Sem PRO"}</Badge>{user.email_verified && <Badge variant="outline">Verificado</Badge>}</div></TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => togglePro(user, !user.is_premium)}>{user.is_premium ? "Remover PRO" : "Dar PRO"}</Button><Button size="sm" variant="destructive" onClick={() => deleteUser(user)}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
          </TabsContent>
          <TabsContent value="vendas" className="mt-5"><Card><CardHeader><CardTitle>Eventos recentes da Cakto</CardTitle></CardHeader><CardContent className="space-y-3">{vendas.slice(0, 12).map((venda) => <div key={venda.id} className="flex items-center justify-between rounded-xl border border-border p-3"><div><p className="font-semibold">{venda.nome_cliente || venda.email_cliente || "Cliente"}</p><p className="text-sm text-muted-foreground">{venda.status || venda.evento}</p></div><Badge>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((venda.valor || 0) / 100)}</Badge></div>)}</CardContent></Card></TabsContent>
          <TabsContent value="avisos" className="mt-5"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Aviso global</CardTitle></CardHeader><CardContent className="space-y-3"><Input placeholder="Título" value={notification.titulo} onChange={(e) => setNotification({ ...notification, titulo: e.target.value })} /><Textarea placeholder="Mensagem para todos os usuários" value={notification.mensagem} onChange={(e) => setNotification({ ...notification, mensagem: e.target.value })} /><Button onClick={createNotification}><Shield className="mr-2 h-4 w-4" /> Enviar aviso</Button></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}