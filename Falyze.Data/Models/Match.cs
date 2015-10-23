using Falyze.Data.DbConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Falyze.Data.Models
{
    public interface IMatch
    {
        DateTime Date { get; set; }
        int HomeTeamId { get; set; }
        int AwayTeamId { get; set; }
        int SeasonId { get; set; }
        int LeagueId { get; set; }
        int CountryId { get; set; }
        byte HomeGoals { get; set; }
        byte AwayGoals { get; set; }
    }

    [Table(TableName = "Matches")]
    public class Match : DbTable, IMatch
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public System.DateTime Date { get; set; }
        public int HomeTeamId { get; set; }
        public int AwayTeamId { get; set; }
        public int SeasonId { get; set; }
        public int LeagueId { get; set; }
        public int CountryId { get; set; }
        public byte HomeGoals { get; set; }
        public byte AwayGoals { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("Id"));
            this.Key = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Key"));
            this.Date = sqlDataReader.GetDateTime(sqlDataReader.GetOrdinal("Date"));
            this.HomeTeamId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("HomeTeamId"));
            this.AwayTeamId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("AwayTeamId"));
            this.SeasonId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("SeasonId"));
            this.LeagueId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("LeagueId"));
            this.CountryId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("CountryId"));
            this.HomeGoals = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("HomeGoals"));
            this.AwayGoals = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("AwayGoals"));
        }
    }
}
