using ControleGastos.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Data
{
    // configura acesso ao banco sqlite
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();

        // define relações e conversões do modelo
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // exclui transações junto com a pessoa
            modelBuilder.Entity<Pessoa>()
                .HasMany(p => p.Transacoes)
                .WithOne(t => t.Pessoa)
                .HasForeignKey(t => t.IdPessoa)
                .OnDelete(DeleteBehavior.Cascade);

            // guarda o tipo como texto no banco
            modelBuilder.Entity<Transacao>()
                .Property(t => t.Tipo)
                .HasConversion<string>();
        }
    }

}
