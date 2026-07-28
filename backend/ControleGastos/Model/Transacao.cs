using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Model
{
    // representa uma transação de uma pessoa
    public class Transacao
    {
        public int Id { get; set; }
        public decimal Valor { get; set; } = 0;
        public TipoTransacao Tipo { get; set; }
        public int IdPessoa { get; set; }
        public Pessoa Pessoa { get; set; }
        public string Descricao { get; set; } = string.Empty;

    }
}
