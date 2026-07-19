// Utilitário de tracking local para o dashboard de progresso.
// Tudo é armazenado em localStorage para funcionar mesmo sem autenticação.

const K_REDACOES = "aprovia_progresso_redacoes";
const K_SIMULADOS = "aprovia_progresso_simulados";
const K_ROTINA = "aprovia_progresso_rotina";
const K_USO = "aprovia_progresso_uso"; // { total: seconds, dias: { "YYYY-MM-DD": seconds } }
const K_ATIVIDADES = "aprovia_progresso_atividades";

export interface RedacaoRegistro {
  nota: number;
  data: string; // ISO
  competencias?: Record<string, { nota: number }>;
}

export interface SimuladoRegistro {
  data: string;
  duracaoSegundos: number;
  concluido: boolean;
}

export interface RotinaSalva {
  rotina: Record<string, { horario: string; atividade: string; tipo: string }[]>;
  horasEstudoSemana?: number;
  savedAt: string;
}

export interface UsoRegistro {
  total: number; // segundos
  dias: Record<string, number>; // YYYY-MM-DD -> segundos
  ultimoDia?: string;
}

export interface AtividadeItem {
  tipo: "redacao" | "simulado" | "rotina" | "estudo";
  descricao: string;
  data: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export function getRedacoes(): RedacaoRegistro[] {
  return read<RedacaoRegistro[]>(K_REDACOES, []);
}
export function saveRedacao(r: RedacaoRegistro) {
  const list = getRedacoes();
  list.push(r);
  write(K_REDACOES, list.slice(-50));
  pushAtividade({
    tipo: "redacao",
    descricao: `Redação corrigida — nota ${r.nota}`,
    data: r.data,
  });
}

export function getSimulados(): SimuladoRegistro[] {
  return read<SimuladoRegistro[]>(K_SIMULADOS, []);
}
export function saveSimulado(s: SimuladoRegistro) {
  const list = getSimulados();
  list.push(s);
  write(K_SIMULADOS, list.slice(-50));
  pushAtividade({
    tipo: "simulado",
    descricao: s.concluido
      ? `Simulado concluído (${Math.round(s.duracaoSegundos / 60)} min)`
      : `Simulado iniciado`,
    data: s.data,
  });
}

export function getRotina(): RotinaSalva | null {
  return read<RotinaSalva | null>(K_ROTINA, null);
}
export function saveRotina(rotina: RotinaSalva["rotina"], horasEstudoSemana?: number) {
  const val: RotinaSalva = {
    rotina,
    horasEstudoSemana,
    savedAt: new Date().toISOString(),
  };
  write(K_ROTINA, val);
  pushAtividade({
    tipo: "rotina",
    descricao: "Rotina de estudos atualizada",
    data: val.savedAt,
  });
}

export function getUso(): UsoRegistro {
  return read<UsoRegistro>(K_USO, { total: 0, dias: {} });
}
export function addUso(seconds: number) {
  if (seconds <= 0) return;
  const uso = getUso();
  const hoje = new Date().toISOString().slice(0, 10);
  uso.total += seconds;
  uso.dias[hoje] = (uso.dias[hoje] || 0) + seconds;
  uso.ultimoDia = hoje;
  write(K_USO, uso);
}

export function getAtividades(): AtividadeItem[] {
  return read<AtividadeItem[]>(K_ATIVIDADES, []);
}
function pushAtividade(a: AtividadeItem) {
  const list = getAtividades();
  list.unshift(a);
  write(K_ATIVIDADES, list.slice(0, 20));
}

// Streak = quantos dias consecutivos com uso > 0, terminando hoje ou ontem
export function getStreak(): number {
  const uso = getUso();
  const dias = uso.dias || {};
  let streak = 0;
  const d = new Date();
  // permite quebrar em 1 dia (se ainda não abriu hoje)
  if (!dias[d.toISOString().slice(0, 10)]) {
    d.setDate(d.getDate() - 1);
  }
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (dias[key] && dias[key] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function formatDuracao(seg: number): string {
  if (seg < 60) return `${seg}s`;
  const m = Math.floor(seg / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h ${mm}min` : `${h}h`;
}

export function diaAtualKey(): string {
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  return dias[new Date().getDay()];
}
