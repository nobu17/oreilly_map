using System;
using System.Threading.Tasks;
using Blazored.LocalStorage;

namespace Infrastructure.Blazor.Json
{
    public class LocalDataManagementService
    {
        private readonly ILocalStorageService _localStorage;

        public LocalDataManagementService(ILocalStorageService localStorage)
        {
            _localStorage = localStorage;
        }

        public async Task SaveAsync<T>(T data) where T : class
        {
            var saveData = new SavedData<T>() { SavedDateTime = DateTime.Now, Data = data };
            await _localStorage.SetItemAsync<SavedData<T>>(GetName<T>(), saveData);
        }

        public async Task<T> GetAsync<T>(TimeSpan expiredLimit) where T : class
        {
            var leng = await _localStorage.LengthAsync();
            if (await _localStorage.ContainKeyAsync(GetName<T>()))
            {
                try
                {
                    var data = await _localStorage.GetItemAsync<SavedData<T>>(GetName<T>());
                    var diff = DateTime.Now - data.SavedDateTime;
                    // check expired or not
                    if (expiredLimit.TotalMilliseconds < diff.TotalMilliseconds)
                    {
                        await _localStorage.RemoveItemAsync(GetName<T>());
                        return null;
                    }
                    return data.Data;
                }
                catch (Exception)
                {
                    await _localStorage.RemoveItemAsync(GetName<T>());
                }
            }
            return null;
        }

        public async Task ClearAsync()
        {
            await _localStorage.ClearAsync();
        }

        private string GetName<T>()
        {
            return typeof(T).Name;
        }
    }

    public class SavedData<T> where T : class
    {
        public DateTime SavedDateTime { get; set; }

        public T Data { get; set; }
    }
}
