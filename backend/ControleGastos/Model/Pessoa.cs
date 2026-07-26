using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Model
{
    public class Pessoa
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; } = 0;
        public List<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
