using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domains.Models
{
    public interface IStoreRepository
    {
        Task<IEnumerable<Store>> GetAllAsync();
        Task<IEnumerable<Store>> GetAsync(Prefecture prefecture);
        Task<IEnumerable<Store>> GetNearestAsync(double latitude, double longtitude, int maxCount);
    }
}
