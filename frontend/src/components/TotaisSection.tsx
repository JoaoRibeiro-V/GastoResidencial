import { useEffect, useState } from 'react';
import type { TotaisResponse, PessoaResponse } from '../types';
import { pessoasApi, totalApi } from '../services/api';

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// totais por pessoa com detalhe das transações
export function TotaisSection() {
  const [totais, setTotais] = useState<TotaisResponse | null>(null);
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // busca totais e pessoas juntos
    Promise.all([
      totalApi.obter(),
      pessoasApi.listar(),
    ])
      .then(([totaisData, pessoasData]) => {
        setTotais(totaisData);
        setPessoas(pessoasData);
      })
      .catch((e) => {
        setErro(
          e instanceof Error
            ? e.message
            : 'Erro ao carregar dados.'
        );
      });
  }, []);

  if (erro) {
    return <p className="error-message">{erro}</p>;
  }

  if (!totais) {
    return null;
  }

  return (
    <>
      <section className="card">
        <h2 className="card__title">
          Totais por pessoa
        </h2>

        {totais.pessoas.length === 0 ? (
          <p className="empty-state">
            Nenhuma pessoa cadastrada ainda.
          </p>
        ) : (
          <div className="totals-list">
            {totais.pessoas.map((p) => {
              const movimentado = p.totalReceitas + p.totalDespesas;

              const percReceita = movimentado > 0 ? (p.totalReceitas / movimentado) * 100 : 0;

              const percDespesa = movimentado > 0? (p.totalDespesas / movimentado) * 100 : 0;

              const pessoa = pessoas.find(
                (pessoa) => pessoa.id === p.pessoaId
              );

              const selecionada =
                pessoaSelecionada === p.pessoaId;

              return (
                <div
                  className={`person-total ${selecionada
                    ? 'person-total--selected'
                    : ''
                    }`}
                  key={p.pessoaId}
                  onClick={() =>
                    setPessoaSelecionada(
                      selecionada ? null : p.pessoaId
                    )
                  }
                >
                  <div className="person-total__header">
                    <span className="person-total__name">
                      {p.nome}
                    </span>

                    <span className="person-total__saldo">
                      {formatoMoeda.format(p.saldo)}
                    </span>
                  </div>

                  <div className="balance-bar">
                    <div
                      className="balance-bar__receita"
                      style={{
                        width: `${percReceita}%`,
                      }}
                    />

                    <div
                      className="balance-bar__despesa"
                      style={{
                        width: `${percDespesa}%`,
                      }}
                    />
                  </div>

                  <div className="person-total__figures">
                    <span>
                      Receitas:{' '}
                      <strong>
                        {formatoMoeda.format(
                          p.totalReceitas
                        )}
                      </strong>
                    </span>

                    <span>
                      Despesas:{' '}
                      <strong>
                        {formatoMoeda.format(
                          p.totalDespesas
                        )}
                      </strong>
                    </span>
                  </div>

                  {selecionada && pessoa && (
                    <div className="person-transactions">
                      <h3>
                        Transações de {pessoa.nome}
                      </h3>

                      {pessoa.transacoes.length === 0 ? (
                        <p className="empty-state">
                          Essa pessoa não possui transações.
                        </p>
                      ) : (
                        <div className="transactions-list">
                          {pessoa.transacoes.map(
                            (transacao) => (
                              <div
                                className="transaction-item"
                                key={transacao.id}
                              >
                                <div>
                                  <strong>
                                    {transacao.descricao}
                                  </strong>
                                  <br></br>
                                  <span>
                                    {transacao.tipo.toUpperCase()}
                                  </span>
                                </div>

                                <strong>
                                  {formatoMoeda.format(
                                    transacao.valor
                                  )}
                                </strong>
                                <hr></hr>
                              </div>
                              
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grand-total">
        <div className="grand-total__item">
          <span className="grand-total__label">
            Total de receitas
          </span>

          <span className="grand-total__value">
            {formatoMoeda.format(
              totais.totalReceitasGeral
            )}
          </span>
        </div>

        <div className="grand-total__item">
          <span className="grand-total__label">
            Total de despesas
          </span>

          <span className="grand-total__value">
            {formatoMoeda.format(
              totais.totalDespesasGeral
            )}
          </span>
        </div>

        <div className="grand-total__item">
          <span className="grand-total__label">
            Saldo líquido
          </span>

          <span className="grand-total__value">
            {formatoMoeda.format(
              totais.saldoGeral
            )}
          </span>
        </div>
      </div>
    </>
  );
}
