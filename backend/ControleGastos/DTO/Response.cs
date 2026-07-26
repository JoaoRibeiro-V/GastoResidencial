using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.DTO;

public record PessoaResponse(int Id, string Nome, int Idade);
public record TransacaoResponse(int Id, string Descricao, decimal Valor, TipoTransacao Tipo, int PessoaId, string PessoaNome);