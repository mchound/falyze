using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Cache
{
    public interface ICacheService
    {
        T Get<T>() where T : class;
        T Get<T>(int seasonId, int leagueId) where T : class;
        void Add<T>(int seasonId, int leagueId, T item) where T : class;
        void Add<T>(T item) where T : class;
    }

    public class CacheService : ICacheService
    {
        private const string CACHE_KEY_FORMAT = "Falyze.Cache.{0}";
        private const string SPECIFIC_CACHE_KEY_FORMAT = "Falyze.Cache.{0}.{1}.{2}";

        public T Get<T>() where T : class
        {
            return MemoryCache.Default.Get(CreateKey<T>()) as T;
        }

        public T Get<T>(int seasonId, int leagueId) where T : class
        {
            return MemoryCache.Default.Get(CreateKey<T>(seasonId, leagueId)) as T;
        }

        public void Add<T>(int seasonId, int leagueId, T item) where T : class
        {
            MemoryCache.Default.Add(CreateKey<T>(seasonId, leagueId), item, new CacheItemPolicy());
        }

        public void Add<T>(T item) where T : class
        {
            MemoryCache.Default.Add(CreateKey<T>(), item, new CacheItemPolicy());
        }

        private string CreateKey<T>()
        {
            return string.Format(CACHE_KEY_FORMAT, typeof(T).FullName);
        }

        private string CreateKey<T>(int seasonId, int leagueId)
        {
            return string.Format(SPECIFIC_CACHE_KEY_FORMAT, typeof(T).FullName, seasonId, leagueId);
        }
    }
}
