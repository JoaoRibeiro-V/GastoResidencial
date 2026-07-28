import { useEffect, useMemo, useState } from 'react';
import type { Pessoa, Transacao, TipoTransacao } from '../types';
import { pessoasApi, transacoesApi } from '../services/api';

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// cadastro de transações com criação e listagem
export function TransacoesSection() {

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const pessoaSelecionada = pessoas.find((p) => p.id === Number(pessoaId));
  const apenasDespesaPermitida = !!pessoaSelecionada && pessoaSelecionada.idade < 18;

  useEffect(() => {
    carregarTudo();
  }, []);

  // busca transações e pessoas
  async function carregarTudo() {
    try {
      const [listaTransacoes, listaPessoas] = await Promise.all([
        transacoesApi.listar(),
        pessoasApi.listar(),
      ]);
      setTransacoes(listaTransacoes);
      setPessoas(listaPessoas);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados.');
    }
  }

  // abre ou fecha o popup
  async function handleAbrirPopup(bool: boolean) {
    setIsPopupOpen(bool);
  }

  // valida e envia form de transação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const valorNumero = Number(valor.replace(',', '.'));
    // valida descrição preenchida
    if (!descricao.trim()) {
      setErro('Informe a descrição da transação.');
      return;
    }
    // valida pessoa selecionada
    if (!pessoaId) {
      setErro('Selecione a pessoa responsável pela transação.');
      return;
    }
    // valida valor maior que zero
    if (!valor || Number.isNaN(valorNumero) || valorNumero <= 0) {
      setErro('Informe um valor válido, maior que zero.');
      return;
    }

    setEnviando(true);
    try {
      // envia pro backend
      await transacoesApi.criar({
        descricao: descricao.trim(),
        valor: valorNumero,
        tipo,
        pessoaId: Number(pessoaId),
      });
      // limpa form e recarrega lista
      setDescricao('');
      setValor('');
      setIsPopupOpen(false);
      await carregarTudo();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao cadastrar transação.');
    } finally {
      setEnviando(false);
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
                  <td>{t.pessoa.nome}</td>
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
                <label data-disabled={apenasDespesaPermitida || undefined}>
                  <input
                    disabled={apenasDespesaPermitida}
                    type="radio"
                    name="tipo"
                    checked={tipo === 'receita'}
                    onChange={() => setTipo('receita')}
                  />
                  Receita
                </label>
                <label>
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === 'despesa'}
                    onChange={() => setTipo('despesa')}
                  />
                  Despesa
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
