using ControleGastos.DTO;
using ControleGastos.Model;
using ControleGastos.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Controller
{
    // endpoint dos totais
    [ApiController]
    [Route("api/[controller]")]
    public class TotalController : ControllerBase
    {
        private readonly ITotaisService _service;
        // recebe o service injetado
        public TotalController(ITotaisService service) => _service = service;

        // obtem totais por pessoa e geral
        [HttpGet]
        public async Task<ActionResult<TotaisResponse>> Obter()
        {
            return Ok(await _service.ObterTotaisAsync());
        }
    }
}
