using ControleGastos.Data;
using ControleGastos.Model;
using ControleGastos.Services;
using Microsoft.EntityFrameworkCore;

var caminhoDb = Path.Combine(AppContext.BaseDirectory, "controlegastos.db");
var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlite($"Data Source={caminhoDb}")
    .Options;

using var context = new AppDbContext(options);
context.Database.EnsureCreated();

var pessoaService = new PessoaService(context);
var transacaoService = new TransacaoService(context);
var totaisService = new TotalService(context);

Console.WriteLine("Pessoas:");
foreach (var pessoa in pessoaService.ListarAsync().Result)
{
    Console.WriteLine($"Pessoa: {pessoa.Nome}, Idade: {pessoa.Idade}");
}

Console.WriteLine("\nTransacoes:");

foreach (var transacao in transacaoService.ListarAsync().Result)
{
    Console.WriteLine($"Transação: {transacao.Descricao}, Valor: {transacao.Valor}, Tipo: {transacao.Tipo}, Pessoa: {transacao.Pessoa.Nome}");
}

Console.WriteLine("\nTotais:");

totaisService.ObterTotaisAsync().ContinueWith(task =>
{
    var totais = task.Result;
    Console.WriteLine($"Total Receitas Geral: {totais.TotalReceitasGeral}");
    Console.WriteLine($"Total Despesas Geral: {totais.TotalDespesasGeral}");
    Console.WriteLine($"Saldo Geral: {totais.SaldoGeral}");
    foreach (var pessoaTotal in totais.Pessoas)
    {
        Console.WriteLine($"Pessoa: {pessoaTotal.Nome}, Total Receitas: {pessoaTotal.TotalReceitas}, Total Despesas: {pessoaTotal.TotalDespesas}, Saldo: {pessoaTotal.Saldo}");
    }
}).Wait();