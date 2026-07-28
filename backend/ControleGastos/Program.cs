using ControleGastos.Data;
using ControleGastos.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// configura banco sqlite
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite("Data Source=controlegastos.db"));
// registra os services
builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<ITotaisService, TotalService>();
// configura enum como texto no json
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters
        .Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));

// libera cors pro frontend
builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// cria o banco se não existir
using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();

app.UseCors("Frontend");
app.MapControllers();
app.Run();
