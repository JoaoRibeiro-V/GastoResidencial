using ControleGastos.Data;
using ControleGastos.DTO;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

public interface IPessoaService
{
    Task<Pessoa> CriarAsync(string nome, int idade);
    Task<List<PessoaResponse>> ListarAsync();
    Task<Pessoa> ObterPorIdAsync(int id);
    Task<bool> AtualizarAsync(int id, string nome, int idade);
    Task<bool> DeletarAsync(int id);
}

public class PessoaService : IPessoaService
{
    private readonly AppDbContext _context;

    public PessoaService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Pessoa> CriarAsync(string nome, int idade)
    {
        var pessoa = new Pessoa { Nome = nome, Idade = idade };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return null;

    }

    public async Task<bool> DeletarAsync(int id)
    {
        var pessoa = await _context.Pessoas
            .Include(p => p.Transacoes)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pessoa is null) return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return true;
    }

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
    public async Task<Pessoa> ObterPorIdAsync(int id)
    {
        return await _context.Pessoas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    public async Task<bool> AtualizarAsync(int id, string nome, int idade)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null) return false;

        pessoa.Nome = nome;
        pessoa.Idade = idade;

        await _context.SaveChangesAsync();
        return true;
    }
}
