using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domains.Models;

namespace Infrastructures.InMemory
{
    public class InMemoryStoreRepository : IStoreRepository
    {
        private readonly List<Store> _storeList;

        public InMemoryStoreRepository()
        {
            _storeList = new List<Store>();
            _storeList.Add(new Store("Test1", "411-0802", "0556716151", "静岡県沼津市XXXX", "https://xxxx", "https://xxxx", new Position(90, 60.55)));
            _storeList.Add(new Store("Test2", "411-0802", "0556716151", "静岡県沼津市XXXX", "https://xxxx", "https://xxxx", new Position(90, 60.55)));
        }

        public async Task<IEnumerable<Store>> GetAllAsync()
        {
            await Task.Delay(1000);
            return _storeList;
        }

        public async Task<IEnumerable<Store>> GetAsync(Prefecture prefecture)
        {
            await Task.Delay(1000);
            return _storeList.Where(s => s.IsSamePrefecure(prefecture));
        }

        public async Task<IEnumerable<Store>> GetNearestAsync(double latitude, double longtitude, int maxCount)
        {
            return await Task.Factory.StartNew(() => _storeList.OrderBy(s => s.Position.GetDistance(latitude, longtitude)).Take(maxCount));
        }
    }
}
