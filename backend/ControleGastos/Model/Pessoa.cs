using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Model
{
    // representa uma pessoa cadastrada no sistema
    public class Pessoa
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; } = 0;
        public List<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
