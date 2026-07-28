import { useEffect, useState } from 'react';
import type { Pessoa } from '../types';
import { pessoasApi } from '../services/api';
// cadastro de pessoas com criação edição e exclusão
export function PessoasSection() {

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [whichPopup, setWhichPopup] = useState<'create' | 'edit'>('create');
  const [pessoaEditandoId, setPessoaEditandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  // busca pessoas no backend
  async function carregarPessoas() {
    try {
      setPessoas(await pessoasApi.listar());
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar pessoas.');
    }
  }

  // define qual popup mostrar
  function handleSetPopup(which: 'create' | 'edit') {
    setWhichPopup(which);
  }


  // abre ou fecha o popup
  function handleAbrirPopup(
    bool: boolean,
    which: 'create' | 'edit',
    pessoa?: Pessoa
  ) {
    handleSetPopup(which);
    setIsPopupOpen(bool);

    // preenche form pra edição
    if (which === 'edit' && pessoa) {
      setPessoaEditandoId(pessoa.id);
      setNome(pessoa.nome);
      setIdade(String(pessoa.idade));
    }

    // limpa form pra criação
    if (which === 'create') {
      setPessoaEditandoId(null);
      setNome('');
      setIdade('');
    }

    // limpa form ao fechar
    if (!bool) {
      setPessoaEditandoId(null);
      setNome('');
      setIdade('');
      setErro(null);
    }
  }

  // valida e envia form de pessoa
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const idadeNumero = Number(idade);

    // valida nome preenchido
    if (!nome.trim()) {
      setErro('Informe o nome da pessoa.');
      return;
    }

    // valida idade valida
    if (idade === '' || Number.isNaN(idadeNumero) || idadeNumero < 0) {
      setErro('Informe uma idade válida.');
      return;
    }

    try {
      // cria ou atualiza conforme o popup
      if (whichPopup === 'create') {
        await pessoasApi.criar({
          nome: nome.trim(),
          idade: idadeNumero,
        });
      } else if (whichPopup === 'edit' && pessoaEditandoId !== null) {
        await pessoasApi.atualizar(pessoaEditandoId, {
          nome: nome.trim(),
          idade: idadeNumero,
        });
      }

      // limpa form e recarrega lista
      setNome('');
      setIdade('');
      setPessoaEditandoId(null);
      setIsPopupOpen(false);

      await carregarPessoas();
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : whichPopup === 'create'
            ? 'Erro ao cadastrar pessoa.'
            : 'Erro ao atualizar pessoa.'
      );
    }
  }

  // exclui pessoa e recarrega lista
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
            onClick={() => handleAbrirPopup(true, 'create')}
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
                  <td className="col-acao">
                    <button
                      className="btn btn--ghost"
                      onClick={() => handleAbrirPopup(true, 'edit', p)}
                    >
                      Editar
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

            {whichPopup === 'create' ? (
              <div>
                <h2 className="card__title">
                  Nova pessoa

                  <span
                    className="close"
                    onClick={() => handleAbrirPopup(false, 'create')}
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
            ) : whichPopup === 'edit' ? (
              <div>
                <h2 className="card__title">
                  Editar pessoa

                  <span
                    className="close"
                    onClick={() => handleAbrirPopup(false, 'edit')}
                  >
                    &times;
                  </span>
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="nome-edit">Nome</label>

                      <input
                        id="nome-edit"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Maria Silva"
                      />
                    </div>

                    <div
                      className="form-field"
                      style={{ flex: '0 1 120px' }}
                    >
                      <label htmlFor="idade-edit">Idade</label>

                      <input
                        id="idade-edit"
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
                      Salvar alterações
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
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
