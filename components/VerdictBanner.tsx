import type { ComparisonResult } from "@/lib/compare";
import { CheckIcon } from "./icons";

export function VerdictBanner({ result }: { result: ComparisonResult }) {
  const { a, b, overall, scoreA, scoreB, aWins, bWins, ties, decidedBy } = result;
  const total = aWins + bWins + ties;
  const isTie = overall === "tie";
  const winner = overall === "a" ? a : b;
  const loser = overall === "a" ? b : a;
  const winnerWins = overall === "a" ? aWins : bWins;
  const byScore = decidedBy === "score";

  const segA = overall === "a" ? "bg-accent" : isTie ? "bg-foreground/40" : "bg-muted/30";
  const segB = overall === "b" ? "bg-accent" : isTie ? "bg-foreground/40" : "bg-muted/30";

  return (
    <div className="card relative overflow-hidden p-5 sm:p-7">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 place-items-center rounded-full ${isTie ? "bg-foreground/10 text-foreground" : "bg-accent text-accent-foreground"}`}>
            <CheckIcon width={18} height={18} strokeWidth={3} />
          </span>
          {isTie ? (
            <span className="text-2xl font-semibold sm:text-3xl">תיקו צמוד</span>
          ) : (
            <span className="ltr text-2xl font-semibold sm:text-3xl">{winner.name}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">
          {isTie ? (
            byScore ? (
              <>ביצועים כוללים שקולים</>
            ) : (
              <>שני הרכיבים שקולים — {aWins}:{bWins} מתוך {total} מדדים</>
            )
          ) : byScore ? (
            <>
              ביצועים כוללים גבוהים יותר · ציון{" "}
              <span className="mono font-medium text-foreground">{winner.score}</span> מול <span className="mono">{loser.score}</span>
            </>
          ) : (
            <>מנצח ב-<span className="mono font-medium text-foreground">{winnerWins}</span> מתוך <span className="mono">{total}</span> מדדים מרכזיים</>
          )}
        </p>
      </div>

      {/* בר ניקוד דו-צדדי (A מימין, B משמאל ב-RTL) */}
      <div className="mx-auto mt-6 max-w-xl">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="ltr max-w-[45%] truncate text-muted">{a.name}</span>
          <span className="ltr max-w-[45%] truncate text-muted">{b.name}</span>
        </div>
        <div className="flex h-2.5 w-full gap-1 overflow-hidden">
          <div className={`h-full rounded-s-full transition-all duration-700 ${segA}`} style={{ width: `${scoreA}%` }} />
          <div className={`h-full rounded-e-full transition-all duration-700 ${segB}`} style={{ width: `${scoreB}%` }} />
        </div>
        <div className="mono mt-1.5 flex items-center justify-between text-xs tabular-nums">
          <span className={overall === "a" ? "font-semibold text-accent" : "text-muted"}>{scoreA}%</span>
          <span className={overall === "b" ? "font-semibold text-accent" : "text-muted"}>{scoreB}%</span>
        </div>
      </div>
    </div>
  );
}
