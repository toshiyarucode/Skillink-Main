import { Coins, TrendingDown, TrendingUp, Lock } from 'lucide-react';
import { useDemo } from './store';
import { PageHeading } from './shell';

export function Wallet() {
  const { balance, ledger, agreements } = useDemo();
  const reserved = agreements.filter((a) => a.reserved).reduce((sum, a) => sum + a.amount, 0);
  const received = ledger.filter((l) => l.amount > 0 && l.type !== 'Estorno').reduce((s, l) => s + l.amount, 0);
  const used = ledger.filter((l) => l.amount < 0).reduce((s, l) => s + Math.abs(l.amount), 0);

  return (
    <>
      <PageHeading title="Sua carteira de Service Credits" subtitle="Acompanhe seu saldo, créditos reservados e movimentações. Tudo em SC, sem dinheiro real." />
      <div className="wallet-banner">
        <div>
          <span className="flex items-center gap-2 text-xs opacity-80"><Coins size={15} />Saldo disponível</span>
          <h2>{balance.toLocaleString('pt-BR')} <span className="text-base font-normal opacity-80">SC</span></h2>
          <p>Pronto para contratar serviços de qualquer país.</p>
        </div>
        <div className="text-right">
          <span className="flex items-center gap-2 text-xs opacity-80 justify-end"><Lock size={14} />Reservados</span>
          <p className="text-2xl font-semibold mt-2">{reserved.toLocaleString('pt-BR')} SC</p>
          <p className="opacity-70 text-xs mt-1">Em serviços em andamento</p>
        </div>
      </div>

      <div className="stats mt-6">
        <div className="stat">
          <div className="stat-top"><span>Créditos recebidos</span><span className="stat-icon text-success"><TrendingUp size={17} /></span></div>
          <div className="stat-number">{received.toLocaleString('pt-BR')} <span className="text-sm font-normal text-muted-foreground">SC</span></div>
          <p className="stat-bottom">Por serviços que você prestou</p>
        </div>
        <div className="stat">
          <div className="stat-top"><span>Créditos utilizados</span><span className="stat-icon text-warning"><TrendingDown size={17} /></span></div>
          <div className="stat-number">{used.toLocaleString('pt-BR')} <span className="text-sm font-normal text-muted-foreground">SC</span></div>
          <p className="stat-bottom">Em contratações e compensações</p>
        </div>
        <div className="stat">
          <div className="stat-top"><span>Disponível agora</span><span className="stat-icon text-primary"><Coins size={17} /></span></div>
          <div className="stat-number">{balance.toLocaleString('pt-BR')} <span className="text-sm font-normal text-muted-foreground">SC</span></div>
          <p className="stat-bottom">Livre para novas contratações</p>
        </div>
        <div className="stat">
          <div className="stat-top"><span>Reservados</span><span className="stat-icon text-violet"><Lock size={17} /></span></div>
          <div className="stat-number">{reserved.toLocaleString('pt-BR')} <span className="text-sm font-normal text-muted-foreground">SC</span></div>
          <p className="stat-bottom">Em execução no momento</p>
        </div>
      </div>

      <div className="section-heading"><h2>Histórico de movimentações</h2><span className="text-xs text-muted-foreground">Dados de demonstração</span></div>
      <div className="list-panel">
        {ledger.map((m, i) => (
          <div className="activity" key={i}>
            <span className={`avatar ${m.amount < 0 ? 'avatar-2' : 'avatar-1'}`}>
              {m.amount < 0 ? <TrendingDown size={15} /> : <TrendingUp size={15} />}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="truncate">{m.label}</h3>
              <p className="mt-1">{m.type}</p>
            </div>
            <span className={`text-sm font-semibold ${m.amount < 0 ? 'text-warning' : 'text-success'}`}>
              {m.amount > 0 ? '+' : ''}{m.amount} SC
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border bg-secondary p-4 mt-6">
        <p className="text-xs text-muted-foreground">
          Os Service Credits são exclusivos da plataforma e não podem ser convertidos em dinheiro nesta versão.
          A distribuição inicial de SC e as regras detalhadas de contestação permanecem pendentes de definição.
        </p>
      </div>
    </>
  );
}
