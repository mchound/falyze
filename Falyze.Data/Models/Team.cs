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
    [Table(TableName = "Teams")]
    public class Team : BulkWritable
    {
        public Guid CountryId { get; set; }
        public string Name { get; set; }

        public override void Map(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.CountryId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("CountryId"));
        }

        public override Dictionary<string, string> GetEntityValues()
        {
            return new Dictionary<string, string>
            {
                { "Id", string.Format("'{0}'", this.Id.ToString())},
                { "CountryId", string.Format("'{0}'", this.CountryId.ToString())},
                { "Name", string.Format("N'{0}'", this.Name)}
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
