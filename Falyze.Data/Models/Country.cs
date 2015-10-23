using Falyze.Data.DbConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Falyze.Data.Models
{
    [Table(TableName = "Countries")]
    public class Country : DbTable
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
        }
    }
}
