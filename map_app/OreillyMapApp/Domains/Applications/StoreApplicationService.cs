using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domains.Models;

namespace Domains.Applications
{
    public class StoreApplicationService
    {
        private readonly IStoreRepository _storeRepository;

        public StoreApplicationService(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public Task<IEnumerable<Store>> GetAllAsync()
        {
            return _storeRepository.GetAllAsync();
        }

        public Task<IEnumerable<Store>> GetAsync(Prefecture prefecture)
        {
            return _storeRepository.GetAsync(prefecture);
        }

        public Task<IEnumerable<Store>> GetNearestAsync(double latitude, double longtidue, int maxCount)
        {
            return _storeRepository.GetNearestAsync(latitude, longtidue, maxCount);
        }

        public Task<string> GetLastUpdatedAsync()
        {
            return _storeRepository.GetLastUpdatedAsync();
        }
    }
}
