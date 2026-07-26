using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ControleGastos.DTO;

public record CreatePessoaDto(
    [Required, StringLength(100)] string Nome,
    [Range(0, 130)] int Idade
);

public record CreateTransacaoDto(
    [Required, StringLength(200)] string Descricao,
    [Range(0.01, double.MaxValue)] decimal Valor,
    TipoTransacao Tipo,
    int PessoaId
);
