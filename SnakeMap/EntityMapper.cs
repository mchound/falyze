using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    public static class EntityMapper
    {
        public static IEnumerable<T> MapToEntities<T>(SqlDataReader reader) where T : Table, new()
        {
            while (reader.Read())
            {
                var instance = new T();
                instance.MapToEntity(reader);
                yield return instance;
            }
        }
    }
}
