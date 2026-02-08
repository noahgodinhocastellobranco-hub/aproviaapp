import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Questao } from "@/data/materiaisEstudo";
import FormattedText from "@/components/FormattedText";

interface QuizQuestionProps {
  questao: Questao;
  numero: number;
}

export default function QuizQuestion({ questao, numero }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return; // já respondeu
    setSelected(index);
  };

  const isCorrect = selected === questao.correta;
  const answered = selected !== null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">
        <span className="text-primary font-bold mr-1">Questão {numero}.</span>
        {questao.enunciado}
      </p>

      <div className="space-y-2">
        {questao.opcoes.map((opcao, i) => {
          const letter = String.fromCharCode(65 + i); // A, B, C, D
          const isThis = selected === i;
          const isRight = i === questao.correta;

          let optionClass =
            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm";

          if (!answered) {
            optionClass += " border-border hover:border-primary/50 hover:bg-primary/5";
          } else if (isRight) {
            optionClass += " border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
          } else if (isThis && !isRight) {
            optionClass += " border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
          } else {
            optionClass += " border-border opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(optionClass, "w-full text-left")}
            >
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  !answered && "border-muted-foreground/30 text-muted-foreground",
                  answered && isRight && "border-green-500 bg-green-500 text-white",
                  answered && isThis && !isRight && "border-red-500 bg-red-500 text-white",
                  answered && !isRight && !isThis && "border-muted-foreground/20 text-muted-foreground/50"
                )}
              >
                {answered && isRight ? (
                  <CheckCircle className="h-4 w-4" />
                ) : answered && isThis && !isRight ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  letter
                )}
              </span>
              <span className="flex-1">{opcao}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={cn(
            "p-3 rounded-lg text-sm mt-2",
            isCorrect
              ? "bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400"
          )}
        >
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            {isCorrect ? (
              <>
                <CheckCircle className="h-4 w-4" /> Correto!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" /> Incorreto
              </>
            )}
          </p>
          <FormattedText text={questao.explicacao} />
        </div>
      )}
    </div>
  );
}
