using ControleGastos.Data;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;
public class PessoaTotalDto
{
    public int PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

// Resposta completa da consulta de totais: cada pessoa e o total geral
public class TotaisResponse
{
    public List<PessoaTotalDto> Pessoas { get; set; } = new();
    public decimal TotalReceitasGeral { get; set; }
    public decimal TotalDespesasGeral { get; set; }
    public decimal SaldoGeral { get; set; }
}

public interface ITotaisService
{
    Task<TotaisResponse> ObterTotaisAsync();
}

public class TotalService : ITotaisService
{
    private readonly AppDbContext _context;

    public TotalService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<TotaisResponse> ObterTotaisAsync()
    {
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Id)
            .ToListAsync();

        // Calcula receitas, despesas e saldo de cada pessoa
        var totaisPorPessoa = pessoas.Select(p => new PessoaTotalDto
        {
            PessoaId = p.Id,
            Nome = p.Nome,
            TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
            TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
            Saldo = p.Transacoes.Sum(t => t.Tipo == TipoTransacao.Receita ? t.Valor : -t.Valor)
        }).ToList();

        // Soma os totais
        return new TotaisResponse
        {
            Pessoas = totaisPorPessoa,
            TotalReceitasGeral = totaisPorPessoa.Sum(p => p.TotalReceitas),
            TotalDespesasGeral = totaisPorPessoa.Sum(p => p.TotalDespesas),
            SaldoGeral = totaisPorPessoa.Sum(p => p.Saldo)
        };
    }
}
