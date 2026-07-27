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
    public class TotalController : ControllerBase
    {
        private readonly ITotaisService _service;
        public TotalController(ITotaisService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<TotaisResponse>> Obter()
        {
            return Ok(await _service.ObterTotaisAsync());
        }
    }
}
