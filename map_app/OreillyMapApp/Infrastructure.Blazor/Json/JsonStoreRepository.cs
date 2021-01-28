using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Blazored.LocalStorage;
using Domains.Models;
using Microsoft.AspNetCore.Components;

namespace Infrastructure.Blazor.Json
{
    public class JsonStoreRepository : IStoreRepository
    {
        private const string StoreKey = "StoreList";
        // 24 hours retain
        private readonly TimeSpan ExpiredLimit = new TimeSpan(24, 0, 0);

        private readonly HttpClient _http;
        private readonly LocalDataManagementService _localStore;

        private string _jsonFileUrl;
        private List<Store> _storeList;
        private string _updateDate;

        public JsonStoreRepository(HttpClient http, LocalDataManagementService localStore)
        {
            if (http == null) throw new ArgumentException(nameof(http));
            if (localStore == null) throw new ArgumentException(nameof(localStore));

            _http = http;
            _localStore = localStore;
        }

        public void Init(string jsonFileUrl)
        {
            _jsonFileUrl = jsonFileUrl;
        }

        public async Task<string> GetUpdatedDate()
        {
            if (string.IsNullOrWhiteSpace(_updateDate))
            {
                await GetAllAsync();
            }
            return _updateDate;
        }

        public async Task<IEnumerable<Store>> GetAllAsync()
        {
            if (_storeList == null || !_storeList.Any())
            {
                var data = await _localStore.GetAsync<JsonStoreList>(ExpiredLimit);
                if (data != null)
                {
                    _storeList = data.Stores.Select(s => s.ToStore()).ToList();
                    _updateDate = data.UpdateDate;
                    return _storeList;
                }

                var stores = await _http.GetFromJsonAsync<JsonStoreList>(_jsonFileUrl);
                await _localStore.SaveAsync(stores);

                _storeList = stores.Stores.Select(s => s.ToStore()).ToList();
                _updateDate = stores.UpdateDate;
            }
            return _storeList;
        }

        public async Task<IEnumerable<Store>> GetAsync(Prefecture prefecture)
        {
            var stores = await GetAllAsync();
            return stores.Where(s => s.IsSamePrefecure(prefecture));
        }

        public async Task<IEnumerable<Store>> GetNearestAsync(double latitude, double longtitude, int maxCount)
        {
            var stores = await GetAllAsync();
            var nears = stores.OrderBy(s => s.Position.GetDistance(latitude, longtitude)).Take(maxCount).ToList();
            return nears;
        }
    }

    public class JsonStoreList
    {
        public string UpdateDate { get; set; }

        public List<JsonStore> Stores { get; set; }
    }

    public class JsonStore
    {
        public string Name { get; set; }

        public string Post { get; set; }

        public string Address { get; set; }

        public string Tel { get; set; }

        public string StoreUrl { get; set; }

        public string MapUrl { get; set; }

        public JsonPosition Position { get; set; }

        public Store ToStore()
        {
            return new Store(Name, Post, Tel, Address, StoreUrl, MapUrl, Position.ToPosition());
        }
    }

    public class JsonPosition
    {
        public double Lat { get; set; }

        public double Long { get; set; }

        public Position ToPosition()
        {
            return new Position(Lat, Long);
        }
    }
}

