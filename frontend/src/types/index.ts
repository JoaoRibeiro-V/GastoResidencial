export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export type TipoTransacao = 'despesa' | 'receita';

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoa: Pessoa;
  pessoaId: number;
  pessoaNome: string;
}

export interface PessoaTotal {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisResponse {
  pessoas: PessoaTotal[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoGeral: number;
}

export type TransacaoResponse = {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  idPessoa: number;
};

export type PessoaResponse = {
  id: number;
  nome: string;
  idade: number;
  transacoes: TransacaoResponse[];
};