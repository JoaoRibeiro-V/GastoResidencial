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