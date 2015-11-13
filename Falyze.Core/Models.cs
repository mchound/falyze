using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Business
{
    public class Match
    {
        public Guid SeasonId { get; set; }
        public Guid CountryId { get; set; }
        public Guid LeagueId { get; set; }
        public Guid HomeTeamId { get; set; }
        public Guid AwayTeamId { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public byte HomeGoals { get; set; }
        public byte AwayGoals { get; set; }
        public DateTime Date { get; set; }
        public TableRow HomeTeamTable { get; set; }
        public TableRow HomeTeamHomeTable { get; set; }
        public TableRow HomeTeamAwayTable { get; set; }
        public TableRow AwayTeamTable { get; set; }
        public TableRow AwayTeamHomeTable { get; set; }
        public TableRow AwayTeamAwayTable { get; set; }
        public int[] HomeTeamStreak { get; set; }
        public int[] HomeTeamHomeStreak { get; set; }
        public int[] HomeTeamAwayStreak { get; set; }
        public int[] AwayTeamStreak { get; set; }
        public int[] AwayTeamHomeStreak { get; set; }
        public int[] AwayTeamAwayStreak { get; set; }
    }

    public class TableRow : ICloneable
    {
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
        public int Position { get; set; }
        public int Round { get; set; }
        public int Wins { get; set; }
        public int Draws { get; set; }
        public int Losses { get; set; }
        public int GoalsFor { get; set; }
        public int GoalsAgainst { get; set; }
        public int GoalDiff { get; set; }
        public int Points { get; set; }

        public object Clone()
        {
            return new TableRow
            {
                TeamId = this.TeamId,
                TeamName = this.TeamName,
                Position = this.Position,
                Round = this.Round,
                Wins = this.Wins,
                Draws = this.Draws,
                Losses = this.Losses,
                GoalsFor = this.GoalsFor,
                GoalsAgainst = this.GoalsAgainst,
                GoalDiff = this.GoalDiff,
                Points = this.Points
            };
        }
    }

    public class TableSet
    {
        public Guid SeasonId { get; set; }
        public Guid LeagueId { get; set; }
        public List<TableRow> Table { get; set; }
        public List<TableRow> HomeTable { get; set; }
        public List<TableRow> AwayTable { get; set; }

        public TableSet(IEnumerable<Match> matches)
        {
            this.Table = new List<TableRow>();
            this.HomeTable = new List<TableRow>();
            this.AwayTable = new List<TableRow>();
        }
    }

}
