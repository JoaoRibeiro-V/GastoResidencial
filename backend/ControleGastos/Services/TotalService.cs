using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

public record PessoaTotal(int PessoaId, string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);
public record TotaisGerais(List<PessoaTotal> Pessoas, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

public interface ITotaisService
{
    Task<TotaisGerais> ObterTotaisAsync();
}
public class TotalService : ITotaisService
{
    public Task<TotaisGerais> ObterTotaisAsync()
    {
        throw new NotImplementedException();
    }
}
