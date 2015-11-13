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
    public class Season : Table
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int StartYear { get; set; }
        public Guid LeagueId { get; set; }
        public bool MultipleYears { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Name = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Name"));
            this.StartYear = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("StartYear"));
            this.LeagueId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("LeagueId"));
            this.MultipleYears = sqlDataReader.GetBoolean(sqlDataReader.GetOrdinal("MultipleYears"));
        }
    }
    

    //[Table(Name = "Seasons")]
    //public class Season : Table
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //    public int StartYear { get; set; }
    //    public int CountryId { get; set; }
    //}
}
