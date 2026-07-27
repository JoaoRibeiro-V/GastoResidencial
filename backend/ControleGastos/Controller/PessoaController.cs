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
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaService _service;
        public PessoasController(IPessoaService service) => _service = service;

        [HttpPost]
        public async Task<ActionResult<Pessoa>> Criar(CreatePessoaDto dto)
        {
            var pessoa = await _service.CriarAsync(dto.Nome, dto.Idade);
            return Ok(pessoa);
        }

        [HttpGet]
        public async Task<ActionResult<List<Pessoa>>> Listar()
        {
            return Ok(await _service.ListarAsync());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _service.DeletarAsync(id);
            return NoContent();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Pessoa>> ObterPorId(int id)
        {
            var pessoa = await _service.ObterPorIdAsync(id);
            if (pessoa is null) return NotFound();
            return Ok(pessoa);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, UpdatePessoaDto dto)
        {
            var atualizado = await _service.AtualizarAsync(id, dto.Nome, dto.Idade);
            if (!atualizado) return NotFound();
            return NoContent();
        }
    }
}
