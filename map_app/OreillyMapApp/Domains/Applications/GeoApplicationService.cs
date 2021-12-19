using Domains.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Applications
{
    public class GeoApplicationService
    {
        private readonly IGeoRepository _geoRepository;

        public GeoApplicationService(IGeoRepository geoRepository)
        {
            _geoRepository = geoRepository;
        }

        public Task<Position> GetCurrentPositionAsync()
        {
            return _geoRepository.GetCurrentPositionAsync();
        }
    }
}
