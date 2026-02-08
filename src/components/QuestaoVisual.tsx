import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { MessageSquare } from "lucide-react";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 220 70% 50%))",
  "hsl(var(--chart-3, 150 60% 45%))",
  "hsl(var(--chart-4, 40 80% 55%))",
  "hsl(var(--chart-5, 0 70% 55%))",
  "hsl(280, 60%, 55%)",
  "hsl(200, 70%, 50%)",
];

interface GraficoData {
  tipo: "grafico";
  tipoGrafico: "barras" | "linha" | "pizza";
  titulo: string;
  eixoX?: string;
  eixoY?: string;
  dados: { nome: string; valor: number }[];
}

interface TirinhaData {
  tipo: "tirinha";
  titulo: string;
  quadros: { personagem: string; fala: string }[];
  fonte: string;
}

interface TabelaData {
  tipo: "tabela";
  titulo: string;
  colunas: string[];
  linhas: (string | number)[][];
}

export type QuestaoVisualData = GraficoData | TirinhaData | TabelaData;

function GraficoBarras({ data }: { data: GraficoData }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-center text-muted-foreground mb-2">{data.titulo}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data.dados} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="nome" tick={{ fontSize: 11 }} label={data.eixoX ? { value: data.eixoX, position: "insideBottom", offset: -3, fontSize: 11 } : undefined} />
          <YAxis tick={{ fontSize: 11 }} label={data.eixoY ? { value: data.eixoY, angle: -90, position: "insideLeft", fontSize: 11 } : undefined} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
            {data.dados.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GraficoLinha({ data }: { data: GraficoData }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-center text-muted-foreground mb-2">{data.titulo}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data.dados} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="nome" tick={{ fontSize: 11 }} label={data.eixoX ? { value: data.eixoX, position: "insideBottom", offset: -3, fontSize: 11 } : undefined} />
          <YAxis tick={{ fontSize: 11 }} label={data.eixoY ? { value: data.eixoY, angle: -90, position: "insideLeft", fontSize: 11 } : undefined} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function GraficoPizza({ data }: { data: GraficoData }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-center text-muted-foreground mb-2">{data.titulo}</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data.dados}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="valor"
            nameKey="nome"
            label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
            labelLine={{ strokeWidth: 1 }}
          >
            {data.dados.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Tirinha({ data }: { data: TirinhaData }) {
  const bubbleColors = [
    "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  ];

  // Map unique characters to colors
  const charMap = new Map<string, number>();
  data.quadros.forEach(q => {
    if (!charMap.has(q.personagem)) {
      charMap.set(q.personagem, charMap.size);
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">{data.titulo}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.quadros.map((quadro, i) => {
          const colorIdx = charMap.get(quadro.personagem) || 0;
          return (
            <div
              key={i}
              className={`relative rounded-xl border-2 p-3 ${bubbleColors[colorIdx % bubbleColors.length]}`}
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 text-xs font-bold bg-background/80 rounded-full px-2 py-0.5 border">
                  {quadro.personagem}
                </span>
              </div>
              <p className="text-sm mt-1.5 leading-relaxed text-foreground">
                "{quadro.fala}"
              </p>
              <span className="absolute -bottom-1 left-6 w-3 h-3 rotate-45 border-b-2 border-r-2 bg-inherit" style={{ borderColor: 'inherit' }} />
            </div>
          );
        })}
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-2 italic text-right">
        {data.fonte}
      </p>
    </div>
  );
}

function Tabela({ data }: { data: TabelaData }) {
  return (
    <div className="w-full overflow-x-auto">
      <p className="text-xs font-semibold text-center text-muted-foreground mb-2">{data.titulo}</p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {data.colunas.map((col, i) => (
              <th key={i} className="border border-border bg-muted/50 px-3 py-2 text-left font-semibold text-xs">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.linhas.map((linha, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
              {linha.map((cel, j) => (
                <td key={j} className="border border-border px-3 py-1.5 text-xs">
                  {cel}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QuestaoVisual({ visual }: { visual: QuestaoVisualData | null | undefined }) {
  if (!visual) return null;

  return (
    <div className="bg-muted/30 rounded-xl border border-border p-4 my-3">
      {visual.tipo === "grafico" && visual.tipoGrafico === "barras" && <GraficoBarras data={visual} />}
      {visual.tipo === "grafico" && visual.tipoGrafico === "linha" && <GraficoLinha data={visual} />}
      {visual.tipo === "grafico" && visual.tipoGrafico === "pizza" && <GraficoPizza data={visual} />}
      {visual.tipo === "tirinha" && <Tirinha data={visual} />}
      {visual.tipo === "tabela" && <Tabela data={visual} />}
    </div>
  );
}
