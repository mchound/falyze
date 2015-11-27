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
    public interface IMatch
    {
        DateTime Date { get; set; }
        Guid HomeTeamId { get; set; }
        Guid AwayTeamId { get; set; }
        Guid SeasonId { get; set; }
        Guid LeagueId { get; set; }
        Guid CountryId { get; set; }
        byte HomeGoals { get; set; }
        byte AwayGoals { get; set; }
    }

    [Table(Name = "Matches")]
    public class Match : Entity, IMatch
    {
        public string Key { get; set; }
        public DateTime Date { get; set; }
        public Guid HomeTeamId { get; set; }
        public Guid AwayTeamId { get; set; }
        public Guid SeasonId { get; set; }
        public Guid LeagueId { get; set; }
        public Guid CountryId { get; set; }
        public byte HomeGoals { get; set; }
        public byte AwayGoals { get; set; }

        public override Dictionary<string, string> GetEntityValues()
        {
            Dictionary<string, string> fieldValues = new Dictionary<string, string>();
            fieldValues.Add("Id", string.Format("'{0}'", this.Id.ToString()));
            fieldValues.Add("Key", string.Format("'{0}'", this.Key));
            fieldValues.Add("Date", string.Format("'{0}'", this.Date.ToString("yyyy-MM-dd")));
            fieldValues.Add("HomeTeamId", string.Format("'{0}'", this.HomeTeamId.ToString()));
            fieldValues.Add("AwayTeamId", string.Format("'{0}'", this.AwayTeamId.ToString()));
            fieldValues.Add("SeasonId", string.Format("'{0}'", this.SeasonId.ToString()));
            fieldValues.Add("LagueId", string.Format("'{0}'", this.LeagueId.ToString()));
            fieldValues.Add("CountryId", string.Format("'{0}'", this.CountryId.ToString()));
            fieldValues.Add("HomeGoals", string.Format("{0}", this.HomeGoals.ToString()));
            fieldValues.Add("AwayGoals", string.Format("{0}", this.AwayGoals.ToString()));
            return fieldValues;
        }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            this.Id = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("Id"));
            this.Key = sqlDataReader.GetString(sqlDataReader.GetOrdinal("Key"));
            this.Date = sqlDataReader.GetDateTime(sqlDataReader.GetOrdinal("Date"));
            this.HomeTeamId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("HomeTeamId"));
            this.AwayTeamId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("AwayTeamId"));
            this.SeasonId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("SeasonId"));
            this.LeagueId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("LeagueId"));
            this.CountryId = sqlDataReader.GetGuid(sqlDataReader.GetOrdinal("CountryId"));
            this.HomeGoals = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("HomeGoals"));
            this.AwayGoals = sqlDataReader.GetByte(sqlDataReader.GetOrdinal("AwayGoals"));
        }

        public static IEnumerable<DataColumn> GetDataColumns()
        {
            return new DataColumn[] {
                new DataColumn("Id", typeof(Guid)),
                new DataColumn("SeasonId", typeof(Guid)),
                new DataColumn("LeagueId", typeof(Guid)),
                new DataColumn("CountryId", typeof(Guid)),
                new DataColumn("Key", typeof(string)),
                new DataColumn("Date", typeof(DateTime)),
                new DataColumn("HomeTeamId", typeof(Guid)),
                new DataColumn("AwayTeamId", typeof(Guid)),
                new DataColumn("homeGoals", typeof(byte)),
                new DataColumn("Awaygoals", typeof(byte))
            };
        }

        public override object[] GetColumnValues()
        {
            return new object[]
            {
                this.Id,
                this.SeasonId,
                this.LeagueId,
                this.CountryId,
                this.Key,
                this.Date,
                this.HomeTeamId,
                this.AwayTeamId,                
                this.HomeGoals,
                this.AwayGoals
            };
        }
    }

    [Table(Name = "Matches")]
    public class ClientMatch : Match
    {
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }

        public override void MapToEntity(SqlDataReader sqlDataReader)
        {
            base.MapToEntity(sqlDataReader);
            this.HomeTeam = sqlDataReader.GetString(sqlDataReader.GetOrdinal("HomeTeam"));
            this.AwayTeam = sqlDataReader.GetString(sqlDataReader.GetOrdinal("AwayTeam"));
        }
    }
}
