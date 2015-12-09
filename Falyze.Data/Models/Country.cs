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
    [Table(TableName = "Countries")]
    public class Country : BulkWritable
    {
        public string Name { get; set; }

        public override void Map(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
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
