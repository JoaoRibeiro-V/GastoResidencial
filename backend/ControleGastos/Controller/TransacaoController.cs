using ControleGastos.DTO;
using ControleGastos.Model;
using ControleGastos.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _service;
        public TransacaoController(ITransacaoService service) => _service = service;

        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<Transacao>> Criar(CreateTransacaoDto dto)
        {
            var transacao = await _service.CriarAsync(dto.Descricao, dto.Valor, dto.Tipo, dto.PessoaId);
            return Ok(transacao);
        }

        [HttpGet]
        public async Task<ActionResult<List<Transacao>>> Listar()
        {
            return Ok(await _service.ListarAsync());
        }
    }
}
