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
        public async Task<IActionResult> Deletar(int id) {
            _service.DeletarAsync(id);
            return NoContent();
        }
    }
}
