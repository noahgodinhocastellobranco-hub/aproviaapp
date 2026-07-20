import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Brain, Camera, CheckCircle2, Crown, KeyRound, LogOut, Mail, MessageCircle, Save, Settings, Shield, User } from "lucide-react";

type Profile = {
  id: string;
  nome: string | null;
  email: string | null;
  is_premium: boolean;
  email_verified: boolean;
  created_at: string | null;
  avatar_url?: string | null;
};

type ChangeType = "password" | "email";

export default function Configuracoes() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpMode, setOtpMode] = useState<ChangeType | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("A imagem deve ter até 5MB."); return; }
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { setUploadingAvatar(false); toast.error("Falha ao enviar imagem."); return; }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;
    const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
    setUploadingAvatar(false);
    if (error) { toast.error("Não foi possível salvar a foto."); return; }
    setProfile({ ...profile, avatar_url: url });
    toast.success("Foto de perfil atualizada!");
  };


  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setProfile(data);
      setNome(data.nome || "");
      setNewEmail(data.email || user.email || "");
    }
    setLoading(false);
  };

  useEffect(() => { loadProfile(); }, []);

  const saveName = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ nome }).eq("id", profile.id);
    setSaving(false);
    if (error) toast.error("Não foi possível salvar o nome.");
    else {
      toast.success("Nome atualizado.");
      setProfile({ ...profile, nome });
    }
  };

  const sendCode = async (type: ChangeType) => {
    const { error, data } = await supabase.functions.invoke("enviar-codigo-otp", {
      body: { type, newValue: type === "email" ? newEmail : undefined },
    });
    if (error) {
      toast.error("Não foi possível enviar o código.");
      return;
    }
    setOtpMode(type);
    setCodeSent(true);
    toast.success("Código enviado para seu email.");
    if (data?.fallbackCode) toast.info(`Código de teste: ${data.fallbackCode}`);
  };

  const confirmChange = async () => {
    if (!otpMode) return;
    if (otpMode === "password" && newPassword !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    const { error } = await supabase.functions.invoke("enviar-codigo-otp", {
      body: {
        action: "verify",
        type: otpMode,
        code,
        newValue: otpMode === "email" ? newEmail : newPassword,
      },
    });

    if (error) {
      toast.error("Código inválido ou expirado.");
      return;
    }
    toast.success(otpMode === "email" ? "Email atualizado." : "Senha atualizada.");
    setCode("");
    setCodeSent(false);
    setOtpMode(null);
    setNewPassword("");
    setConfirmPassword("");
    loadProfile();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-primary font-semibold">Carregando configurações...</div>;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <Button asChild variant="ghost" className="mb-5"><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link></Button>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Settings className="h-7 w-7" /></div>
          <div>
            <h1 className="text-4xl font-black text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Perfil, assinatura, senha, email e segurança.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Perfil</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20"><AvatarFallback className="bg-primary text-2xl font-black text-primary-foreground">{(profile?.nome || profile?.email || "AP").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow border border-border"><Camera className="h-4 w-4 text-primary" /></span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{profile?.nome || "Estudante"}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className={profile?.is_premium ? "bg-success text-success-foreground" : ""}>{profile?.is_premium ? "PRO Ativo" : "Plano grátis"}</Badge>
                    {profile?.email_verified && <Badge variant="outline"><CheckCircle2 className="mr-1 h-3 w-3" /> Email verificado</Badge>}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nome de exibição</Label>
                <div className="flex gap-2"><Input value={nome} onChange={(e) => setNome(e.target.value)} /><Button onClick={saveName} disabled={saving}><Save className="mr-2 h-4 w-4" /> Salvar</Button></div>
              </div>
              <Separator />
              <Button className="w-full" onClick={() => navigate("/dashboard")}><Brain className="mr-2 h-4 w-4" /> Comece a Estudar</Button>
              <Button className="w-full" variant="outline" onClick={() => navigate("/precos")}><Crown className="mr-2 h-4 w-4" /> {profile?.is_premium ? "Ver Plano PRO" : "Assinar Agora"}</Button>
              <Button className="w-full" variant="outline" onClick={() => navigate("/suporte")}><MessageCircle className="mr-2 h-4 w-4" /> Suporte</Button>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Alterar email por código</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="novo@email.com" />
                <Button variant="outline" onClick={() => sendCode("email")}>Enviar código para meu email atual</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary" /> Alterar senha por código</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={() => sendCode("password")}>Enviar código de alteração de senha</Button>
              </CardContent>
            </Card>

            {codeSent && (
              <Card className="border-primary/30">
                <CardHeader><CardTitle>Digite o código de 4 dígitos</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" className="text-center text-2xl font-black tracking-widest" />
                  {otpMode === "password" && (
                    <>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" />
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar nova senha" />
                    </>
                  )}
                  <Button className="w-full" onClick={confirmChange}>Confirmar alteração</Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 font-bold text-foreground"><Shield className="h-5 w-5 text-primary" /> Segurança</div>
                <Button variant="destructive" className="w-full" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sair da Conta</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}