using System;
using System.Collections.Generic;
using System.Text;

namespace ControleGastos.Services
{
    public class ServiceResult<T>
    {
        public bool Success { get; private init; }
        public string? ErrorMessage { get; private init; }
        public T? Data { get; private init; }

        public static ServiceResult<T> Ok(T data) => new() { Success = true, Data = data };
        public static ServiceResult<T> Fail(string message) => new() { Success = false, ErrorMessage = message };
    }
}
