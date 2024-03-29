using Blazored.LocalStorage;
using Domains.Applications;
using Domains.Models;
using Infrastructure.Blazor.Geo;
using Infrastructure.Blazor.Json;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;

namespace OreillyMapApp
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");

            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
            builder.Services.AddMudServices();

            builder.Services.AddMudBlazorDialog();
            builder.Services.AddMudBlazorSnackbar();
            builder.Services.AddMudBlazorResizeListener();

            builder.Services.AddScoped<LocalDataManagementService>();
            builder.Services.AddScoped<IStoreRepository, JsonStoreRepository>();
            //builder.Services.AddSingleton<IStoreRepository, InMemoryStoreRepository>();
            builder.Services.AddScoped<IGeoRepository, JSGeoRepository>();
            builder.Services.AddScoped<StoreApplicationService>();
            builder.Services.AddScoped<GeoApplicationService>();

            builder.Services.AddBlazoredLocalStorage();

            var host = builder.Build();
            var jsonServ = host.Services.GetRequiredService<IStoreRepository>() as JsonStoreRepository;
            jsonServ?.Init("sample-data/stores.json");

            await host.RunAsync();
        }
    }
}
