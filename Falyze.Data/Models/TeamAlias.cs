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
    public class TeamAlias : Entity
    {
        public Guid TeamId { get; set; }
        public string Alias { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Alias = sqlDataReader.GetString(sqlDataReader.GetOrdinal("alias"));
            this.TeamId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("TeamId"));
        }

        public override Dictionary<string, string> GetEntityValues()
        {
            return new Dictionary<string, string>
            {
                { "Id", string.Format("'{0}'", this.Id.ToString())},
                { "TeamId", string.Format("'{0}'", this.TeamId.ToString())},
                { "Alias", string.Format("N'{0}'", this.Alias)}
            };
        }
    }
}
