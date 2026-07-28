using ControleGastos.Data;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using ControleGastos.DTO;

namespace ControleGastos.Services;


// contrato do serviço de totais
public interface ITotaisService
{
    // obtem totais por pessoa e geral
    Task<TotaisResponse> ObterTotaisAsync();
}

// regras de negócio dos totais
public class TotalService : ITotaisService
{
    private readonly AppDbContext _context;

    // recebe o dbcontext injetado
    public TotalService(AppDbContext context)
    {
        _context = context;
    }
    // calcula totais de receita e despesa
    public async Task<TotaisResponse> ObterTotaisAsync()
    {
        // busca pessoas com transações
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Id)
            .ToListAsync();

        // soma receita e despesa por pessoa
        var totaisPorPessoa = pessoas.Select(p => new PessoaTotal
        {
            PessoaId = p.Id,
            Nome = p.Nome,
            TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
            TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
            Saldo = p.Transacoes.Sum(t => t.Tipo == TipoTransacao.Receita ? t.Valor : -t.Valor)
        }).ToList();

        // soma os totais gerais
        return new TotaisResponse
        {
            Pessoas = totaisPorPessoa,
            TotalReceitasGeral = totaisPorPessoa.Sum(p => p.TotalReceitas),
            TotalDespesasGeral = totaisPorPessoa.Sum(p => p.TotalDespesas),
            SaldoGeral = totaisPorPessoa.Sum(p => p.Saldo)
        };
    }
}
