using ControleGastos.Data;
using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

public interface IPessoaService
{
    Task<Pessoa> CriarAsync(string nome, int idade);
    Task<List<Pessoa>> ListarAsync();
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

    public async Task<List<Pessoa>> ListarAsync()
    {
        return await _context.Pessoas
            .AsNoTracking()
            .OrderBy(p => p.Id)
            .ToListAsync();
    }
}
