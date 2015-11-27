using SnakeMap;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.Models
{
    [Table(Name = "Seasons")]
    public class Season : Entity
    {
        public string Name { get; set; }
        public int StartYear { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.StartYear = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("StartYear"));
        }
    }
}
