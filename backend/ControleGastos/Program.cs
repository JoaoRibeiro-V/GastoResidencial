using ControleGastos.Data;
using ControleGastos.Services;
using Microsoft.EntityFrameworkCore;


var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlite("Data Source=controlegastos.db")
    .Options;

using var context = new AppDbContext(options);
context.Database.EnsureCreated();

var pessoaService = new PessoaService(context);

foreach (var pessoa in pessoaService.ListarAsync().Result)
{
    Console.WriteLine($"Pessoa: {pessoa.Nome}, Idade: {pessoa.Idade}");
}