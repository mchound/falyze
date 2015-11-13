using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Falyze.Data.Models
{
    [Table(Name = "TeamAliases")]
    public class TeamAlias : Table
    {
        public Guid Id { get; set; }
        public Guid TeamId { get; set; }
        public string Alias { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Alias = sqlDataReader.GetString(sqlDataReader.GetOrdinal("alias"));
            this.TeamId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("TeamId"));
        }
    }
}
