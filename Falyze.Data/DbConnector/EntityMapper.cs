﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.DbConnector
{
    public static class EntityMapper
    {
        public static IEnumerable<T> MapToEntities<T>(SqlDataReader reader) where T : DbTable, new()
        {
            while(reader.Read())
            {
                var instance = new T();
                instance.MapToEntity(reader);
                yield return instance;                
            }
        }
    }
}
