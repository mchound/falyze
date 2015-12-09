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
    [Table(TableName = "Leagues")]
    public class League : BulkWritable
    {
        public string Name { get; set; }
        public int Level { get; set; }
        public Guid CountryId { get; set; }

        public override void Map(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.Level = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("Level"));
            this.CountryId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("CountryId"));
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
