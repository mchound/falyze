using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.DbConnector
{
    public abstract class DbTable
    {
        public virtual void MapToEntity(SqlDataReader sqlDataReader)
        {
            var properties = this.GetType().GetProperties();
            foreach (var property in properties)
            {
                int index = sqlDataReader.GetOrdinal(property.Name);
                property.SetValue(this, sqlDataReader.GetValue(index));
            }
        }
    }
}
