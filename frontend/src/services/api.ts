import type { Pessoa, Transacao, TipoTransacao, TotaisResponse, PessoaResponse } from '../types';
const API_URL = 'http://localhost:5000/api';

// le a resposta e trata erro
async function handleResponse<T>(res: Response): Promise<T> {
  // le corpo como texto
  const texto = await res.text();
  const dados = texto ? JSON.parse(texto) : undefined;

  if (!res.ok) {
    throw new Error(dados?.erro ?? dados?.title ?? 'Erro na requisição.');
  }
  return dados as T;
}

// chamadas da api de pessoas
export const pessoasApi = {
  // lista pessoas
  listar: () =>
  fetch(`${API_URL}/pessoas`)
    .then((r) => handleResponse<PessoaResponse[]>(r)),

  // cria pessoa nova
  criar: (dto: { nome: string; idade: number }) =>
    fetch(`${API_URL}/pessoas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<Pessoa>(r)),

  // atualiza pessoa existente
  atualizar: (id: number, dto: { nome: string; idade: number }) =>
    fetch(`${API_URL}/pessoas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<void>(r)),

  // remove pessoa pelo id
  deletar: (id: number) =>
    fetch(`${API_URL}/pessoas/${id}`, {
      method: 'DELETE',
    }).then((r) => handleResponse<void>(r)),
};

// chamadas da api de transações
export const transacoesApi = {
  // lista transações
  listar: () => fetch(`${API_URL}/transacao`).then((r) => handleResponse<Transacao[]>(r)),

  // cria transação nova
  criar: (dto: { descricao: string; valor: number; tipo: TipoTransacao; pessoaId: number }) =>
    fetch(`${API_URL}/transacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<Transacao>(r)),
};

// chamadas da api de totais
export const totalApi = {
  // obtem totais por pessoa e geral
  obter: () => fetch(`${API_URL}/total`).then((r) => handleResponse<TotaisResponse>(r)),
}
