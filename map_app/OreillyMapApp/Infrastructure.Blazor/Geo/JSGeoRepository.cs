using Domains.Models;
using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Infrastructure.Blazor.Geo
{
    public class JSGeoRepository : IGeoRepository
    {
        private IJSRuntime _js;
        public JSGeoRepository(IJSRuntime js)
        {
            _js = js;
        }

        public async Task<Position> GetCurrentPositionAsync()
        {
            var geoModule = await _js.InvokeAsync<IJSObjectReference>("import", "./js/geo.js");
            var pos = await geoModule.InvokeAsync<JsPosition>("getCurrentLocation");
            return pos.ToPosition();
        }
    }

    public class JsPosition
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public Position ToPosition()
        {
            return new Position(Latitude, Longitude);
        }
    }
}
