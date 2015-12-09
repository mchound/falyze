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
        public static IEnumerable<T> Map<T>(SqlDataReader reader) where T : Entity, new()
        {
            while (reader.Read())
            {
                var instance = new T();
                instance.Map(reader);
                yield return instance;
            }
        }
    }
}
