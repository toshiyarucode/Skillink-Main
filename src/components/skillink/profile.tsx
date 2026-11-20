import { useState } from 'react';
import { ArrowRightLeft, Check, Plus, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useDemo } from './store';
import { Avatar, PageHeading } from './shell';
import { categories, shortCategories } from './data';

export function Profile() {
  const store = useDemo();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(store.name);
  const [bio, setBio] = useState('Desenvolvedor web apaixonado por criar produtos digitais que simplificam a vida das pessoas. Disposto a trocar talento com criativos de qualquer lugar do mundo.');

  function save() {
    store.setName(name);
    setEditing(false);
    toast.success('Perfil atualizado.');
  }

  function toggleOffered(i: number) {
    store.setOffered((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  }
  function toggleWanted(i: number) {
    store.setWanted((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  }

  return (
    <>
      <PageHeading title="Meu perfil" subtitle="Como os outros talentos veem você e o que você oferece ao mundo." action={
        <Button variant="outline" onClick={() => setEditing(!editing)}>{editing ? 'Cancelar' : 'Editar perfil'}</Button>
      } />
      <div className="profile-layout">
        <aside className="profile-info">
          <Avatar initials={store.name.split(' ').map((p) => p[0]).join('').slice(0, 2)} />
          {editing ? (
            <input className="field text-center" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nome" />
          ) : (
            <h2 className="text-lg font-semibold">{store.name}</h2>
          )}
          <p className="mt-1 text-xs text-muted-foreground">🇧🇷 Brasil · Português e inglês</p>
          <div className="mt-4 flex justify-center gap-3 text-xs">
            <span className="flex items-center gap-1"><Star size={12} className="fill-warning text-warning" />4,9</span>
            <span className="text-muted-foreground">· 32 serviços concluídos</span>
          </div>
          <div className="mt-5 rounded-md bg-secondary p-3 text-xs">
            <p className="font-semibold">{store.balance.toLocaleString('pt-BR')} SC</p>
            <p className="text-muted-foreground mt-1">Saldo disponível</p>
          </div>
        </aside>

        <div>
          <section className="profile-section">
            <h2>Apresentação</h2>
            {editing ? (
              <textarea className="field" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            ) : (
              <p className="detail-text">{bio}</p>
            )}
            {editing && <Button className="mt-3" onClick={save}><Check />Salvar alterações</Button>}
          </section>

          <section className="profile-section">
            <h2>Serviços que ofereço</h2>
            <p className="text-xs text-muted-foreground mb-3">Categorias que você está disposto a prestar.</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => {
                const on = store.offered.includes(i);
                return (
                  <button
                    key={c}
                    onClick={() => toggleOffered(i)}
                    className={`chip ${on ? '!bg-accent !text-primary !border-primary/30' : ''}`}
                    style={on ? { background: 'var(--accent)', color: 'var(--primary)', borderColor: 'color-mix(in oklch,var(--primary) 30%,var(--border))' } : {}}
                  >
                    {on ? <Check size={13} /> : <Plus size={13} />}{shortCategories[i]}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="profile-section">
            <h2>Serviços que procuro</h2>
            <p className="text-xs text-muted-foreground mb-3">Categorias que você quer contratar ou receber.</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => {
                const on = store.wanted.includes(i);
                return (
                  <button
                    key={c}
                    onClick={() => toggleWanted(i)}
                    className="chip"
                    style={on ? { background: 'var(--accent)', color: 'var(--primary)', borderColor: 'color-mix(in oklch,var(--primary) 30%,var(--border))' } : {}}
                  >
                    {on ? <Check size={13} /> : <Plus size={13} />}{shortCategories[i]}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="profile-section">
            <h2>Avaliações de demonstração</h2>
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Sofia Martins</span>
                  <span className="flex items-center gap-1 text-xs text-warning">
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={11} className="fill-warning" />)}
                  </span>
                </div>
                <p className="mt-2 detail-text">“Troca perfeita. Alex entregou o site antes do prazo e com ótima comunicação.”</p>
                <p className="mt-2 text-[10px] text-muted-foreground">Avaliação fictícia · Demonstração</p>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Diego Fernández</span>
                  <span className="flex items-center gap-1 text-xs text-warning">
                    {[1, 2, 3, 4].map((n) => <Star key={n} size={11} className="fill-warning" />)}
                    <Star size={11} className="text-muted-foreground" />
                  </span>
                </div>
                <p className="mt-2 detail-text">“Profissional e atencioso. Recomendo a troca.”</p>
                <p className="mt-2 text-[10px] text-muted-foreground">Avaliação fictícia · Demonstração</p>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2>Histórico de serviços</h2>
            <div className="list-panel">
              {store.agreements.map((a) => (
                <div className="activity" key={a.id}>
                  <Avatar initials={a.service.initials} index={a.service.id} />
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate">{a.service.title}</h3>
                    <p>{a.service.person} · {a.mode}</p>
                  </div>
                  <span className={`status ${a.status === 'Concluído' ? 'done' : a.status === 'Cancelado' ? 'cancelled' : ''}`}>{a.status}</span>
                </div>
              ))}
              <div className="activity">
                <span className="avatar"><ArrowRightLeft size={15} /></span>
                <div><h3>12 serviços concluídos anteriormente</h3><p>Histórico de demonstração</p></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
