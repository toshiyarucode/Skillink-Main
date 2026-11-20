import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Clock, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useDemo } from './store';
import { Avatar, PageHeading } from './shell';
import { categories, shortCategories, type Status } from './data';

const statusOrder: Status[] = ['Aguardando confirmação', 'Aguardando início', 'Em andamento', 'Aguardando aprovação', 'Concluído', 'Cancelado'];
const tabs: { id: 'ativos' | 'concluidos' | 'cancelados'; label: string }[] = [
  { id: 'ativos', label: 'Em andamento' },
  { id: 'concluidos', label: 'Concluídos' },
  { id: 'cancelados', label: 'Cancelados' },
];

export function Services() {
  const store = useDemo();
  const [tab, setTab] = useState<'ativos' | 'concluidos' | 'cancelados'>('ativos');
  const [open, setOpen] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [rating, setRating] = useState(0);

  const list = store.agreements.filter((a) => {
    if (tab === 'ativos') return a.status !== 'Concluído' && a.status !== 'Cancelado';
    if (tab === 'concluidos') return a.status === 'Concluído';
    return a.status === 'Cancelado';
  });

  const active = store.agreements.find((a) => a.id === open);

  function advance(id: number) {
    store.setAgreements((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const idx = statusOrder.indexOf(a.status);
      const next = statusOrder[idx + 1];
      if (!next || next === 'Concluído' || next === 'Cancelado') return a;
      const history = [...a.history, `${new Date().toLocaleDateString('pt-BR')} · Status atualizado para ${next}`];
      let reserved = a.reserved;
      if (next === 'Aguardando início' && a.amount > 0 && !reserved) {
        store.setBalance((b) => b - a.amount);
        store.setLedger((l) => [{ label: `${a.service.title} · ${a.service.person}`, amount: -a.amount, type: 'Reserva' }, ...l]);
        reserved = true;
      }
      if (next === 'Concluído') {
        // handled by confirmation flow
      }
      return { ...a, status: next, history, reserved };
    }));
    setOpen(null);
    toast.success('Status do serviço atualizado.');
  }

  function cancel(id: number) {
    store.setAgreements((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      let history = [...a.history, `${new Date().toLocaleDateString('pt-BR')} · Serviço cancelado`];
      if (a.reserved && a.amount > 0) {
        store.setBalance((b) => b + a.amount);
        store.setLedger((l) => [{ label: `${a.service.title} · Estorno de reserva`, amount: a.amount, type: 'Estorno' }, ...l]);
        history = [...history, `${new Date().toLocaleDateString('pt-BR')} · ${a.amount} SC devolvidos (regras de cancelamento parcial permanecem pendentes)`];
      }
      return { ...a, status: 'Cancelado' as Status, history };
    }));
    setOpen(null);
    toast.success('Serviço cancelado. Créditos reservados devolvidos.');
  }

  function complete(id: number) {
    store.setAgreements((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const history = [...a.history, `${new Date().toLocaleDateString('pt-BR')} · Conclusão confirmada`];
      if (a.reserved && a.amount > 0) {
        store.setLedger((l) => [{ label: `${a.service.title} · Liberação para ${a.service.person}`, amount: a.amount, type: 'Liberação' }, ...l]);
      }
      return { ...a, status: 'Concluído' as Status, history, reserved: false, rating: rating || undefined };
    }));
    setConfirming(null);
    setRating(0);
    setOpen(null);
    toast.success('Serviço concluído. Créditos liberados para o prestador.');
  }

  return (
    <>
      <PageHeading title="Acompanhe cada etapa" subtitle="Serviços acordados, em execução e finalizados. Tudo em um só lugar." />
      <div className="category-strip mb-6">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>
            {t.label} ({store.agreements.filter((a) => t.id === 'ativos' ? a.status !== 'Concluído' && a.status !== 'Cancelado' : t.id === 'concluidos' ? a.status === 'Concluído' : a.status === 'Cancelado').length})
          </Button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <CheckCircle2 className="mx-auto mb-4" />
          <p>Nenhum serviço nesta categoria agora.</p>
        </div>
      ) : (
        <div className="list-panel">
          {list.map((a) => (
            <div className="service-row" key={a.id}>
              <Avatar initials={a.service.initials} index={a.service.id} />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{a.service.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.service.person} · {a.mode} · {a.amount > 0 ? `${a.amount} SC` : 'Sem movimentação'}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{categories[a.service.category]}</p>
              </div>
              <span className={`status ${a.status === 'Concluído' ? 'done' : a.status === 'Cancelado' ? 'cancelled' : a.status === 'Aguardando confirmação' ? 'pending' : ''}`}>{a.status}</span>
              <Button size="sm" variant="outline" onClick={() => setOpen(a.id)}>Ver detalhes</Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null); }}>
        <DialogContent className="modal-scroll max-w-lg">
          {active && (
            <>
              <DialogTitle>{active.service.title}</DialogTitle>
              <DialogDescription>{active.service.person} · {active.mode}</DialogDescription>
              <div className="flex items-center gap-3 mt-2">
                <Avatar initials={active.service.initials} index={active.service.id} />
                <div>
                  <p className="text-sm font-medium">{active.service.person}</p>
                  <p className="text-xs text-muted-foreground">{active.service.flag} {active.service.country} · {shortCategories[active.service.category]}</p>
                </div>
              </div>
              <div className="rounded-md bg-secondary p-4 grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Contratante</span><p className="font-medium mt-1">{store.name}</p></div>
                <div><span className="text-muted-foreground">Prestador</span><p className="font-medium mt-1">{active.service.person}</p></div>
                <div><span className="text-muted-foreground">Modalidade</span><p className="font-medium mt-1">{active.mode}</p></div>
                <div><span className="text-muted-foreground">Valor em SC</span><p className="font-medium mt-1">{active.amount > 0 ? `${active.amount} SC` : 'Sem movimentação'}</p></div>
                <div><span className="text-muted-foreground">Status</span><p className="font-medium mt-1">{active.status}</p></div>
                <div><span className="text-muted-foreground">Créditos reservados</span><p className="font-medium mt-1">{active.reserved ? `${active.amount} SC` : '—'}</p></div>
              </div>
              <div>
                <p className="field-label">Descrição e condições</p>
                <p className="detail-text">{active.notes}</p>
              </div>
              <div>
                <p className="field-label">Histórico de atualizações</p>
                <div className="space-y-2">
                  {active.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Clock size={13} className="mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              {active.status !== 'Concluído' && active.status !== 'Cancelado' && (
                <div className="flex flex-wrap gap-2">
                  {active.status === 'Aguardando aprovação' ? (
                    <Button onClick={() => setConfirming(active.id)}><CheckCircle2 />Confirmar conclusão</Button>
                  ) : (
                    <Button onClick={() => advance(active.id)}><ArrowRight />Avançar etapa</Button>
                  )}
                  <Button variant="outline" onClick={() => cancel(active.id)}><X />Cancelar serviço</Button>
                </div>
              )}
              {active.status === 'Concluído' && active.rating && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Sua avaliação do serviço:</span>
                  <span className="flex items-center gap-1 text-warning"><Star size={13} className="fill-warning" />{active.rating}</span>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirming !== null} onOpenChange={(o) => { if (!o) { setConfirming(null); setRating(0); } }}>
        <DialogContent>
          <DialogTitle>Confirmar conclusão do serviço</DialogTitle>
          <DialogDescription>Avalie a qualidade do serviço recebido antes de finalizar.</DialogDescription>
          <div className="flex justify-center gap-2 my-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-label={`${n} estrelas`} onClick={() => setRating(n)}>
                <Star size={28} className={n <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'} />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">A confirmação libera os créditos reservados para o prestador.</p>
          <Button disabled={rating === 0} onClick={() => confirming !== null && complete(confirming)}>
            <Check />Confirmar e liberar créditos
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
