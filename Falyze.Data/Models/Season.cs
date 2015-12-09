using SnakeMap;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace Falyze.Data.Models
{
    [Table(TableName = "Seasons")]
    public class Season : BulkWritable
    {
        public string Name { get; set; }
        public int StartYear { get; set; }

        public override void Map(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.StartYear = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("StartYear"));
        }

        public override IEnumerable<DataColumn> GetColumns()
        {
            throw new NotImplementedException();
        }

        public override object[] GetColumnValues()
        {
            throw new NotImplementedException();
        }
    }
}
