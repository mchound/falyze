using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Falyze.Data.Models;

using RawMatch = Falyze.Data.Models.Match;

namespace Falyze.Business
{
    public interface ITableBuilder
    {
        void AddMatch(RawMatch rawMatch);
        TableRow GetTableRowCopyForTeam(Guid teamId, MatchSide tableSide);
    }

    public class TableBuilder : ITableBuilder
    {
        private List<TableRow> _table;
        private List<TableRow> _homeTable;
        private List<TableRow> _awayTable;
        private List<RawMatch> _pendingMatches;
        private DateTime _lastDate;

        public TableBuilder(IEnumerable<RawMatch> matches, IEnumerable<Team> teams)
        {
            _table = new List<TableRow>();
            _homeTable = new List<TableRow>();
            _awayTable = new List<TableRow>();
            _pendingMatches = new List<RawMatch>();
            _lastDate = matches.OrderBy(m => m.Date).First().Date;

            var distinctOnTeam = matches.Distinct(new MatchHomeTeamEqualityComparer());

            foreach (var match in distinctOnTeam)
            {
                Guid teamId = match.HomeTeamId;
                string teamName = teams.First(t => t.Id == teamId).Name;
                _table.Add(new TableRow { TeamId = teamId, TeamName = teamName });
                _homeTable.Add(new TableRow { TeamId = teamId, TeamName = teamName });
                _awayTable.Add(new TableRow { TeamId = teamId, TeamName = teamName });
            }
        }

        public void AddMatch(RawMatch rawMatch)
        {
            if(rawMatch.Date > _lastDate)
            {
                _lastDate = rawMatch.Date;
                this.ProcessPendingMatches();
                this.SortTable(_table);
                this.SortTable(_homeTable);
                this.SortTable(_awayTable);
                _pendingMatches.Clear();
                _pendingMatches.Add(rawMatch);
            }
            else
            {
                _pendingMatches.Add(rawMatch);
            }
        }

        public TableRow GetTableRowCopyForTeam(Guid teamId, MatchSide tableSide)
        {
            switch (tableSide)
            {
                case MatchSide.Home:
                    return _homeTable.First(r => r.TeamId == teamId).Clone() as TableRow;
                case MatchSide.Away:
                    return _awayTable.First(r => r.TeamId == teamId).Clone() as TableRow;
                default:
                    return _table.First(r => r.TeamId == teamId).Clone() as TableRow;
            }
        }

        private void ProcessPendingMatches()
        {
            foreach (var match in _pendingMatches)
            {
                this.UpdateTable(_table, match, MatchSide.Neutral);
                this.UpdateTable(_homeTable, match, MatchSide.Home);
                this.UpdateTable(_awayTable, match, MatchSide.Away);
            }
        }

        private void UpdateTable(List<TableRow> table, RawMatch match, MatchSide side)
        {
            TableRow homeTeamRow = null;
            TableRow awayTeamRow = null;
            switch (side)
            {
                case MatchSide.Neutral:
                    homeTeamRow = table.FirstOrDefault(r => r.TeamId == match.HomeTeamId);
                    awayTeamRow = table.FirstOrDefault(r => r.TeamId == match.AwayTeamId);
                    this.UpdateTableRow(homeTeamRow, match, MatchSide.Home);
                    this.UpdateTableRow(awayTeamRow, match, MatchSide.Away);
                    break;
                case MatchSide.Home:
                    homeTeamRow = table.FirstOrDefault(r => r.TeamId == match.HomeTeamId);
                    this.UpdateTableRow(homeTeamRow, match, MatchSide.Home);
                    break;
                case MatchSide.Away:
                    awayTeamRow = table.FirstOrDefault(r => r.TeamId == match.AwayTeamId);
                    this.UpdateTableRow(awayTeamRow, match, MatchSide.Away);
                    break;
                default:
                    break;
            }
        }

        private void UpdateTableRow(TableRow tableRow, RawMatch match, MatchSide side)
        {
            tableRow.Round += 1;
            tableRow.GoalsFor += side == MatchSide.Home ? match.HomeGoals : match.AwayGoals;
            tableRow.GoalsAgainst += side == MatchSide.Home ? match.AwayGoals : match.HomeGoals;
            tableRow.GoalDiff = tableRow.GoalsFor - tableRow.GoalsAgainst;
            tableRow.Wins += side == MatchSide.Home ? (match.HomeGoals > match.AwayGoals ? 1 : 0) : (match.HomeGoals < match.AwayGoals ? 1 : 0);
            tableRow.Losses += side == MatchSide.Home ? (match.HomeGoals < match.AwayGoals ? 1 : 0) : (match.HomeGoals > match.AwayGoals ? 1 : 0);
            tableRow.Draws += match.HomeGoals == match.AwayGoals ? 1 : 0;
            tableRow.Points += side == MatchSide.Home ? (match.HomeGoals > match.AwayGoals ? 3 : match.HomeGoals == match.AwayGoals ? 1 : 0) : (match.HomeGoals < match.AwayGoals ? 3 : match.HomeGoals == match.AwayGoals ? 1 : 0);
        }

        private void SortTable(List<TableRow> table)
        {
            table = table.OrderByDescending(r => r.Points).ThenByDescending(r => r.GoalDiff).ThenByDescending(r => r.GoalsFor).ThenBy(r => r.GoalsAgainst).ThenBy(r => r.TeamName).ToList();
            for (int i = 0; i < table.Count; i++) { table[i].Position = i + 1; }
        }
    }

    public class MatchHomeTeamEqualityComparer : IEqualityComparer<RawMatch>
    {
        public bool Equals(RawMatch x, RawMatch y)
        {
            return x.HomeTeamId == y.HomeTeamId;
        }

        public int GetHashCode(RawMatch obj)
        {
            return obj.HomeTeamId.GetHashCode();
        }
    }
}
