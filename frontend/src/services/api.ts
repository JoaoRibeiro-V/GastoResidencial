import type { Pessoa, Transacao, TipoTransacao, TotaisResponse, PessoaResponse } from '../types';
const API_URL = 'http://localhost:5000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const texto = await res.text();
  const dados = texto ? JSON.parse(texto) : undefined;

  if (!res.ok) {
    throw new Error(dados?.erro ?? dados?.title ?? 'Erro na requisição.');
  }
  return dados as T;
}

export const pessoasApi = {
  listar: () =>
  fetch(`${API_URL}/pessoas`)
    .then((r) => handleResponse<PessoaResponse[]>(r)),

  criar: (dto: { nome: string; idade: number }) =>
    fetch(`${API_URL}/pessoas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<Pessoa>(r)),

  atualizar: (id: number, dto: { nome: string; idade: number }) =>
    fetch(`${API_URL}/pessoas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<void>(r)),

  deletar: (id: number) =>
    fetch(`${API_URL}/pessoas/${id}`, {
      method: 'DELETE',
    }).then((r) => handleResponse<void>(r)),
};

export const transacoesApi = {
  listar: () => fetch(`${API_URL}/transacao`).then((r) => handleResponse<Transacao[]>(r)),

  criar: (dto: { descricao: string; valor: number; tipo: TipoTransacao; pessoaId: number }) =>
    fetch(`${API_URL}/transacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then((r) => handleResponse<Transacao>(r)),
};

export const totalApi = {
  obter: () => fetch(`${API_URL}/total`).then((r) => handleResponse<TotaisResponse>(r)),
}