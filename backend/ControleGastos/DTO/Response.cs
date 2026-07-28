using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.DTO;

// dados de pessoa retornados pela api
public record PessoaResponse(int Id, string Nome, int Idade, List<TransacaoResponse> Transacoes);
// dados de transação retornados pela api
public record TransacaoResponse(int Id, string Descricao, decimal Valor, TipoTransacao Tipo, string PessoaNome, int IdPessoa);
// totais de uma unica pessoa
public class PessoaTotal
{
    public int PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

// resposta completa da consulta de totais
public record TotaisResponse
{
    public List<PessoaTotal> Pessoas { get; set; } = new();
    public decimal TotalReceitasGeral { get; set; }
    public decimal TotalDespesasGeral { get; set; }
    public decimal SaldoGeral { get; set; }
}
