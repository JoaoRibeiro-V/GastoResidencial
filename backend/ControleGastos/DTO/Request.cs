using ControleGastos.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ControleGastos.DTO;

// dados recebidos para cadastrar pessoa
public record CreatePessoaDto(
    [Required, StringLength(100)] string Nome,
    [Range(0, 130)] int Idade
);

// dados recebidos para cadastrar transação
public record CreateTransacaoDto(
    [Required, StringLength(200)] string Descricao,
    [Range(0.01, double.MaxValue)] decimal Valor,
    TipoTransacao Tipo,
    int PessoaId
);

// dados recebidos para atualizar pessoa
public record UpdatePessoaDto(
    [Required, StringLength(100)] string Nome,
    [Range(0, 130)] int Idade
);
