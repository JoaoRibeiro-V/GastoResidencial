using ControleGastos.DTO;
using ControleGastos.Model;
using ControleGastos.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Controller
{
    // endpoints de pessoas
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaService _service;
        // recebe o service injetado
        public PessoasController(IPessoaService service) => _service = service;

        // cria pessoa nova
        [HttpPost]
        public async Task<ActionResult<Pessoa>> Criar(CreatePessoaDto dto)
        {
            var pessoa = await _service.CriarAsync(dto.Nome, dto.Idade);
            return Ok(pessoa);
        }

        // lista todas as pessoas
        [HttpGet]
        public async Task<ActionResult<List<Pessoa>>> Listar()
        {
            return Ok(await _service.ListarAsync());
        }

        // remove pessoa pelo id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _service.DeletarAsync(id);
            return NoContent();
        }

        // busca pessoa pelo id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Pessoa>> ObterPorId(int id)
        {
            var pessoa = await _service.ObterPorIdAsync(id);
            if (pessoa is null) return NotFound();
            return Ok(pessoa);
        }

        // atualiza pessoa existente
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, UpdatePessoaDto dto)
        {
            var atualizado = await _service.AtualizarAsync(id, dto.Nome, dto.Idade);
            if (!atualizado) return NotFound();
            return NoContent();
        }
    }
}
