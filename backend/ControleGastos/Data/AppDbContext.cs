using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /* Uma pessoa tem várias transações; ao excluir a pessoa, o SQLite também
               apaga as transações relacionadas
            */
            modelBuilder.Entity<Pessoa>()
                .HasMany(p => p.Transacoes)
                .WithOne(t => t.Pessoa)
                .HasForeignKey(t => t.IdPessoa)
                .OnDelete(DeleteBehavior.Cascade);

            // Guarda o tipo da transação como texto ("Despesa"/"Receita") em vez de numero (0/1) no banco de dados
            modelBuilder.Entity<Transacao>()
                .Property(t => t.Tipo)
                .HasConversion<string>();
        }
    }

}
