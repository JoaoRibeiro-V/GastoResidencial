import { useEffect, useState } from 'react';
import type { Pessoa } from '../types';
import { pessoasApi } from '../services/api';
// Cadastro de pessoas: formulário de criação + lista com exclusão.
export function PessoasSection() {

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
  carregarPessoas();
}, []);

async function carregarPessoas() {
  try {
    setPessoas(await pessoasApi.listar());
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Erro ao carregar pessoas.');
  }
}

  function handleAbrirPopup(bool: boolean) {
    setIsPopupOpen(bool);

    if (!bool) {
      setNome('');
      setIdade('');
      setErro(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErro(null);

  const idadeNumero = Number(idade);

  if (!nome.trim()) {
    setErro('Informe o nome da pessoa.');
    return;
  }
  if (idade === '' || Number.isNaN(idadeNumero) || idadeNumero < 0) {
    setErro('Informe uma idade válida.');
    return;
  }

  try {
    await pessoasApi.criar({ nome: nome.trim(), idade: idadeNumero });
    setNome('');
    setIdade('');
    setIsPopupOpen(false);
    await carregarPessoas();
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Erro ao cadastrar pessoa.');
  }
}

  async function handleExcluir(id: number) {
  try {
    await pessoasApi.deletar(id);
    await carregarPessoas();
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Erro ao excluir pessoa.');
  }
}

  return (
    <>
      <section className="card">
        <h2 className="card__title">
          Pessoas cadastradas{' '}
          <a
            onClick={() => handleAbrirPopup(true)}
            className="btnCadastro"
          >
            +
          </a>
        </h2>

        {pessoas.length === 0 ? (
          <p className="empty-state">
            Nenhuma pessoa cadastrada ainda.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th className="col-acao"></th>
              </tr>
            </thead>

            <tbody>
              {pessoas.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.idade} anos</td>
                  <td className="col-acao">
                    <button
                      className="btn btn--ghost"
                      onClick={() => handleExcluir(p.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {isPopupOpen && (
        <section className="modal">
          <div className="modal-content">
            <h2 className="card__title">
              Nova pessoa

              <span
                className="close"
                onClick={() => handleAbrirPopup(false)}
              >
                &times;
              </span>
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="nome">Nome</label>

                  <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria Silva"
                  />
                </div>

                <div
                  className="form-field"
                  style={{ flex: '0 1 120px' }}
                >
                  <label htmlFor="idade">Idade</label>

                  <input
                    id="idade"
                    type="number"
                    min={0}
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 30"
                  />
                </div>

                <button
                  className="btn btn--primary"
                  type="submit"
                >
                  Cadastrar
                </button>
              </div>

              {erro && (
                <p
                  className="error-message"
                  style={{ marginTop: 12 }}
                >
                  {erro}
                </p>
              )}
            </form>
          </div>
        </section>
      )}
    </>
  );
}