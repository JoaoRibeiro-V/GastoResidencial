using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.DTO;

public record PessoaResponse(int Id, string Nome, int Idade, List<TransacaoResponse> Transacoes);
public record TransacaoResponse(int Id, string Descricao, decimal Valor, TipoTransacao Tipo, string PessoaNome, int IdPessoa);
public class PessoaTotal
{
    public int PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

// Resposta completa da consulta de totais: cada pessoa e o total geral
public record TotaisResponse
{
    public List<PessoaTotal> Pessoas { get; set; } = new();
    public decimal TotalReceitasGeral { get; set; }
    public decimal TotalDespesasGeral { get; set; }
    public decimal SaldoGeral { get; set; }
}
