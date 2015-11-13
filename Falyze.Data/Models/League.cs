using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Falyze.Data.Models
{
    [Table(Name = "Leagues")]
    public class League : Table
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
        public Guid CountryId { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.Level = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("Level"));
            this.CountryId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("CountryId"));
        }
    }

    //[Table(Name = "Leagues")]
    //public class League : Table
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //    public int Level { get; set; }
    //    public int CountryId { get; set; }
    //}
}
