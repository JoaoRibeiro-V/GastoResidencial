using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services;

public interface ITransacaoService
{
    Task<ServiceResult<Transacao>> CriarAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId);
    Task<List<Transacao>> ListarAsync();
}
public class TransacaoService : ITransacaoService
{
    public Task<ServiceResult<Transacao>> CriarAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId)
    {
        throw new NotImplementedException();
    }

    public Task<List<Transacao>> ListarAsync()
    {
        throw new NotImplementedException();
    }
}
