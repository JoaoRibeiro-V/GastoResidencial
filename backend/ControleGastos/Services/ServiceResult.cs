using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services
{
    // resultado de uma operação com sucesso ou erro
    public class ServiceResult<T>
    {
        public bool Success { get; private init; }
        public string? ErrorMessage { get; private init; }
        public T? Data { get; private init; }

        // monta resultado de sucesso
        public static ServiceResult<T> Ok(T data) => new() { Success = true, Data = data };
        // monta resultado de falha
        public static ServiceResult<T> Fail(string message) => new() { Success = false, ErrorMessage = message };
    }
}
