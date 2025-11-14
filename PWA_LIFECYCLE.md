# Ciclo de Vida do PWA - AprovI.A

## Componentes Integrados

### 1. **PWAUpdatePrompt** 
Exibe um card no topo da tela quando há uma nova versão disponível.
- Detecta automaticamente quando há atualização
- Permite atualizar com um clique
- Pode ser adiado pelo usuário
- Toast de notificação quando detecta atualização

### 2. **PWAOfflineIndicator**
Badge flutuante que mostra o status da conexão.
- Aparece automaticamente quando fica offline
- Mostra quando volta online (desaparece após 3s)
- Toast de notificação nas mudanças de estado
- Posicionado no topo central da tela

### 3. **PWAInstallPrompt**
Prompt discreto no canto inferior para instalação.
- Aparece apenas quando o PWA é instalável
- Pode ser descartado (não aparece novamente)
- Redireciona para página `/install` com instruções
- Informações sobre benefícios da instalação

### 4. **PWAInstallBanner**
Banner promocional com mais detalhes sobre instalação.
- Aparece após 5 segundos da primeira visita
- Mostra benefícios: acesso rápido, offline, sem espaço
- Pode ser descartado (reaparece após 7 dias)
- Design atraente com gradiente

### 5. **PWAStatusBar**
Barra de status na sidebar mostrando informações em tempo real.
- Ícone de "Instalado" quando o app está instalado
- Status Online/Offline em tempo real
- Badge animado quando há atualização disponível
- Versão do app (visível em desktop)
- Tooltips explicativos em cada badge

### 6. **usePWALifecycle Hook**
Hook personalizado para gerenciar todo o estado do PWA.

**Estado retornado:**
```typescript
{
  isInstalled: boolean,      // Se está instalado como PWA
  isOnline: boolean,          // Status de conexão
  hasUpdate: boolean,         // Se há atualização disponível
  isInstallable: boolean,     // Se pode ser instalado
  appVersion: string,         // Versão atual do app
  triggerUpdate: () => void,  // Força atualização
  checkForUpdate: () => void  // Verifica atualizações
}
```

## Fluxo do Ciclo de Vida

### Primeira Visita
1. Service Worker é registrado automaticamente
2. Assets são cacheados para uso offline
3. Após 5s, aparece o **PWAInstallBanner** (se instalável)
4. **PWAInstallPrompt** fica disponível no rodapé

### App Instalado
1. **PWAStatusBar** mostra badge "Instalado"
2. Banners de instalação não aparecem mais
3. App funciona offline automaticamente
4. Notificação quando está pronto offline

### Quando Fica Offline
1. **PWAOfflineIndicator** aparece imediatamente
2. Toast: "Você está offline"
3. Badge "Offline" na **PWAStatusBar**
4. App continua funcionando com cache

### Quando Volta Online
1. **PWAOfflineIndicator** mostra "Online"
2. Toast: "Conexão restaurada"
3. Badge volta para "Online"
4. Indicador desaparece após 3 segundos

### Nova Versão Disponível
1. Service Worker detecta atualização
2. **PWAUpdatePrompt** aparece no topo
3. Badge animado "Atualização" na **PWAStatusBar**
4. Toast de notificação
5. Usuário pode atualizar ou adiar
6. Ao atualizar, página recarrega com nova versão

### Verificação Periódica
- Verifica atualizações a cada 1 hora
- Quando app volta ao foco
- Manualmente via `checkForUpdate()`

## Configurações do Service Worker

### Estratégias de Cache

**CacheFirst** (Fontes, Imagens)
- Busca primeiro no cache
- Ótimo para recursos estáticos
- Expira após período configurado

**NetworkFirst** (API Supabase)
- Tenta rede primeiro
- Fallback para cache se offline
- Timeout de 10 segundos
- Cache válido por 5 minutos

### Limpeza Automática
- `cleanupOutdatedCaches: true` remove caches antigos
- `skipWaiting: true` ativa nova versão imediatamente
- `clientsClaim: true` controla todas as abas

## Notificações

O app solicita permissão para notificações automaticamente e mostra:
- Quando o app fica pronto offline
- Quando há nova versão (se permitido)

## Como Testar

### Testar Offline
1. Abra o DevTools (F12)
2. Aba Network → Marque "Offline"
3. Veja o badge offline aparecer
4. Navegue no app (funciona normalmente)

### Testar Atualização
1. Faça uma mudança no código
2. Faça build: `npm run build`
3. Service Worker detecta mudança
4. Prompt de atualização aparece

### Testar Instalação
1. Desktop Chrome: Ícone de instalação na barra de URL
2. Mobile: Menu → "Instalar app"
3. Ou visite `/install` para instruções

## Estrutura de Arquivos

```
src/
├── components/
│   ├── PWAUpdatePrompt.tsx       # Prompt de atualização
│   ├── PWAOfflineIndicator.tsx   # Indicador online/offline
│   ├── PWAInstallPrompt.tsx      # Prompt pequeno de instalação
│   ├── PWAInstallBanner.tsx      # Banner promocional
│   └── PWAStatusBar.tsx          # Barra de status
├── hooks/
│   ├── usePWAInstall.ts          # Hook de instalação
│   └── usePWALifecycle.ts        # Hook de ciclo de vida
├── pages/
│   └── Install.tsx               # Página de instruções
└── main.tsx                      # Registro do Service Worker

public/
├── icon-192.png                  # Ícone 192x192
├── icon-512.png                  # Ícone 512x512
├── apple-splash.png              # Splash screen iOS
└── browserconfig.xml             # Config para Windows
```

## Métricas e Analytics

Para rastrear eventos do PWA:

```typescript
// No main.tsx
window.addEventListener('appinstalled', () => {
  // Track: PWA instalado
});

// Na atualização
// Track: Versão atualizada

// Online/Offline
// Track: Tempo offline, uso offline
```

## Troubleshooting

### Service Worker não atualiza
- Limpe o cache: DevTools → Application → Clear storage
- Force update: `registration.update()`
- Verifique `skipWaiting` está `true`

### App não instala
- Verifique HTTPS (obrigatório)
- Manifesto válido em `/manifest.webmanifest`
- Service Worker registrado
- Icons nos tamanhos corretos

### Offline não funciona
- Service Worker está ativo?
- Assets estão no cache?
- Verifique estratégia de cache da rota

## Boas Práticas Implementadas

✅ Atualizações automáticas com controle do usuário  
✅ Feedback visual claro em todos os estados  
✅ Instalação promovida mas não intrusiva  
✅ Funcionalidade offline completa  
✅ Cache otimizado por tipo de recurso  
✅ Limpeza automática de caches antigos  
✅ Suporte a notificações  
✅ Responsivo em todos os dispositivos  
✅ Acessibilidade com tooltips e labels  
✅ Performance otimizada
