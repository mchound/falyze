using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace Falyze.Data.Models
{
    [Table(TableName = "TeamAliases")]
    public class TeamAlias : BulkWritable
    {
        public Guid TeamId { get; set; }
        public string Alias { get; set; }

        public override void Map(SqlDataReader sqlDataReader)
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

        public override object[] GetColumnValues()
        {
            throw new NotImplementedException();
        }

        public override IEnumerable<DataColumn> GetColumns()
        {
            throw new NotImplementedException();
        }
    }
}
