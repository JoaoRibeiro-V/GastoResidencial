import { useEffect, useMemo, useState } from 'react';

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Cadastro de transações: formulário de criação + lista.
export function TransacoesSection() {
  type Pessoa = {
    id: number;
    nome: string;
    idade: number;
  };
  type Transacao = {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
    pessoaNome: string;
  };

  type TipoTransacao = 'despesa' | 'receita';

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  async function handleAbrirPopup(bool: boolean) {
    setIsPopupOpen(bool);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const valorNumero = Number(valor.replace(',', '.'));
    if (!descricao.trim()) {
      setErro('Informe a descrição da transação.');
      return;
    }
    if (!pessoaId) {
      setErro('Selecione a pessoa responsável pela transação.');
      return;
    }
    if (!valor || Number.isNaN(valorNumero) || valorNumero <= 0) {
      setErro('Informe um valor válido, maior que zero.');
      return;
    }
  }

  return (
    <>
      <section className="card">
        <h2 className="card__title">Transações cadastradas <a onClick={() => handleAbrirPopup(true)} className="btnCadastro">+</a></h2>
        {transacoes.length === 0 ? (
          <p className="empty-state">Nenhuma transação cadastrada ainda.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Pessoa</th>
                <th>Tipo</th>
                <th className="col-numero">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => (
                <tr key={t.id}>
                  <td>{t.descricao}</td>
                  <td>{t.pessoaNome}</td>
                  <td>
                    <span className={`badge badge--${t.tipo}`}>
                      {t.tipo === 'despesa' ? 'Despesa' : 'Receita'}
                    </span>
                  </td>
                  <td className="col-numero">{formatoMoeda.format(t.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {isPopupOpen && (<section className="modal">
        <div className="modal-content">
          <h2 className="card__title">Nova transação <span className="close" onClick={() => handleAbrirPopup(false)}>&times;</span></h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pessoa">Pessoa</label>
              <select id="pessoa" value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
                <option value="">Selecione…</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.idade} anos)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="descricao">Descrição</label>
              <input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Supermercado"
              />
            </div>
            <div className="form-field" style={{ flex: '0 1 140px' }}>
              <label htmlFor="valor">Valor (R$)</label>
              <input
                id="valor"
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 150,00"
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 12 }}>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'despesa'}
                  onChange={() => setTipo('despesa')}
                />
                Despesa
              </label>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'receita'}
                  onChange={() => setTipo('receita')}
                />
                Receita
              </label>
            </div>
            <button className="btn btn--primary" type="submit" disabled={enviando}>
              {enviando ? 'Salvando…' : 'Cadastrar'}
            </button>
          </div>
        </form>
        
        </div>
        
      </section>
      )}
      {erro && <p className="error-message" style={{ marginTop: 12 }}>{erro}</p>}
    </>
  );
}
