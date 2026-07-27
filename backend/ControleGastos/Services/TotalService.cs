using ControleGastos.Data;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using ControleGastos.DTO;

namespace ControleGastos.Services;


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
        var totaisPorPessoa = pessoas.Select(p => new PessoaTotal
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
