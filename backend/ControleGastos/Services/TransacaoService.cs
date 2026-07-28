using ControleGastos.Data;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

// contrato do serviço de transações
public interface ITransacaoService
{
    // cria transação com validação
    Task<ServiceResult<Transacao>> CriarAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId);
    // lista todas as transações
    Task<List<Transacao>> ListarAsync();
}
// regras de negócio de transações
public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _context;

    // recebe o dbcontext injetado
    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }
    // cria transação e valida regras
    public async Task<ServiceResult<Transacao>> CriarAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId)
    {
        // busca pessoa dona da transação
        var pessoa = await _context.Pessoas.FindAsync(pessoaId);
        if (pessoa is null) return ServiceResult<Transacao>.Fail("Pessoa informada não existe.");
        // bloqueia receita pra menor de idade
        if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)return ServiceResult<Transacao>.Fail("Pessoas menores de 18 anos só podem cadastrar despesas.");
        var transacao = new Transacao
        {
            Descricao = descricao,
            Valor = valor,
            Tipo = tipo,
            IdPessoa = pessoaId
        };
        // adiciona e salva
        pessoa.Transacoes.Add(transacao);
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return ServiceResult<Transacao>.Ok(new Transacao
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            IdPessoa = transacao.IdPessoa
        });
    }

    // lista transações com a pessoa dona
    public async Task<List<Transacao>> ListarAsync()
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .OrderBy(t => t.Id)
            .Select(t => new Transacao
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                IdPessoa = t.IdPessoa,
                Pessoa = t.Pessoa
            })
            .ToListAsync();
    }
}
