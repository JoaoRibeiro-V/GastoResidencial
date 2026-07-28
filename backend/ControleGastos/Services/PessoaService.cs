using ControleGastos.Data;
using ControleGastos.DTO;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

// contrato do serviço de pessoas
public interface IPessoaService
{
    // cria pessoa nova
    Task<Pessoa> CriarAsync(string nome, int idade);
    // lista todas as pessoas
    Task<List<PessoaResponse>> ListarAsync();
    // busca pessoa pelo id
    Task<Pessoa> ObterPorIdAsync(int id);
    // atualiza nome e idade
    Task<bool> AtualizarAsync(int id, string nome, int idade);
    // remove pessoa pelo id
    Task<bool> DeletarAsync(int id);
}

// regras de negócio de pessoas
public class PessoaService : IPessoaService
{
    private readonly AppDbContext _context;

    // recebe o dbcontext injetado
    public PessoaService(AppDbContext context)
    {
        _context = context;
    }
    // cria pessoa e salva no banco
    public async Task<Pessoa> CriarAsync(string nome, int idade)
    {
        var pessoa = new Pessoa { Nome = nome, Idade = idade };

        // adiciona e salva
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return null;

    }

    // remove pessoa e transações
    public async Task<bool> DeletarAsync(int id)
    {
        // busca pessoa com transações
        var pessoa = await _context.Pessoas
            .Include(p => p.Transacoes)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pessoa is null) return false;

        // remove e salva
        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return true;
    }

    // lista pessoas com suas transações
    public async Task<List<PessoaResponse>> ListarAsync()
{
    return await _context.Pessoas
        .Include(p => p.Transacoes)
        .Select(p => new PessoaResponse(
            p.Id,
            p.Nome,
            p.Idade,
            p.Transacoes
                .Select(t => new TransacaoResponse(
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Pessoa.Nome,
                    t.IdPessoa
                ))
                .ToList()
        ))
        .ToListAsync();
}
    // busca pessoa por id sem rastrear
    public async Task<Pessoa> ObterPorIdAsync(int id)
    {
        return await _context.Pessoas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    // atualiza pessoa existente
    public async Task<bool> AtualizarAsync(int id, string nome, int idade)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null) return false;

        // aplica novos valores
        pessoa.Nome = nome;
        pessoa.Idade = idade;

        await _context.SaveChangesAsync();
        return true;
    }
}
