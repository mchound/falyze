using Falyze.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Statistics
{
    public class StatisticManager
    {
        //public IEnumerable<Match> BuildMatches(IEnumerable<Falyze.Data.Models.Match> matches, IEnumerable<Falyze.Data.Models.Team> teams)
        //{
        //    List<TableRow> table = new List<TableRow>();
        //    List<TableRow> homeTable = new List<TableRow>();
        //    List<TableRow> awayTable = new List<TableRow>();
        //    Dictionary<int, List<int>> streaks = new Dictionary<int, List<int>>();
        //    Dictionary<int, List<int>> homeStreaks = new Dictionary<int, List<int>>();
        //    Dictionary<int, List<int>> awayStreaks = new Dictionary<int, List<int>>();
        //    List<Falyze.Data.Models.Match> pendingMatches = new List<Data.Models.Match>();
        //    Dictionary<int, string> teamNames = teams.ToDictionary(t => t.Id, t => t.Name);
        //    DateTime lastDate = matches.First().Date;
        //    List<Match> _matches = new List<Match>();

        //    if (matches.Count() == 0)
        //    {
        //        return Enumerable.Empty<Match>();
        //    }

        //    foreach (var match in matches)
        //    {
        //        if(lastDate == match.Date)
        //        {
        //            pendingMatches.Add(match);
        //            continue;
        //        }
        //        else
        //        {
        //            lastDate = match.Date;
        //            _matches.AddRange(this.CreateMatches(pendingMatches, table, homeTable, awayTable, teamNames));
        //            this.SortTable(table);
        //            this.SortTable(homeTable);
        //            this.SortTable(awayTable);
        //            pendingMatches.Clear();
        //            pendingMatches.Add(match);
        //        }
        //    }

        //    _matches.AddRange(this.CreateMatches(pendingMatches, table, homeTable, awayTable, teamNames));
        //    this.SortTable(table);
        //    this.SortTable(homeTable);
        //    this.SortTable(awayTable);
        //    return _matches;
        //}

        //public TableSet BuildTableSet(IEnumerable<Match> matches, IEnumerable<Falyze.Data.Models.Team> teams)
        //{
        //    TableSet set = new TableSet();
        //    DateTime lastDate = matches.First().Date;
        //    set.SeasonId = matches.First().SeasonId;
        //    set.LeagueId = matches.First().LeagueId;
        //    List<Match> pending = new List<Match>();
        //    Dictionary<int, string> teamNames = teams.ToDictionary(t => t.Id, t => t.Name);

        //    foreach (var match in matches)
        //    {
        //        if(lastDate == match.Date)
        //        {
        //            pending.Add(match);
        //            continue;
        //        }
        //        else
        //        {
        //            lastDate = match.Date;
        //            this.AddPendingToTableSet(set, pending, teamNames);
        //            this.SortTable(set.Table);
        //            this.SortTable(set.AwayTable);
        //            this.SortTable(set.HomeTable);
        //            pending.Clear();
        //            pending.Add(match);
        //        }
        //    }

        //    this.AddPendingToTableSet(set, pending, teamNames);
        //    this.SortTable(set.Table);
        //    this.SortTable(set.AwayTable);
        //    this.SortTable(set.HomeTable);

        //    return set;

        //}

        //private void AddPendingToTableSet(TableSet set, IEnumerable<Match> matches, Dictionary<int, string> teamNames)
        //{
        //    foreach (var match in matches)
        //    {
        //        TableRow homeTeamTable = this.GetTableRow(set.Table, match.HomeTeamId, teamNames[match.HomeTeamId]);
        //        TableRow awayTeamTable = this.GetTableRow(set.Table, match.AwayTeamId, teamNames[match.AwayTeamId]);
        //        TableRow homeTeamHomeTable = this.GetTableRow(set.HomeTable, match.HomeTeamId, teamNames[match.HomeTeamId]);
        //        TableRow awayTeamAwayTable = this.GetTableRow(set.AwayTable, match.AwayTeamId, teamNames[match.AwayTeamId]);
        //        this.UpdateTableRows(match, homeTeamTable, awayTeamTable, homeTeamHomeTable, awayTeamAwayTable);
        //    }
        //}

        //private void SortTable(List<TableRow> table)
        //{
        //    table = table.OrderByDescending(r => r.Points).ThenByDescending(r => r.GoalDiff).ThenByDescending(r => r.GoalsFor).ThenBy(r => r.GoalsAgainst).ThenBy(r => r.TeamName).ToList();
        //    for (int i = 0; i < table.Count; i++) { table[i].Position = i + 1; }
        //}

        //private void UpdateTableRows(Falyze.Data.Models.IMatch pendingMatch, TableRow homeTeamTable, TableRow awayTeamTable, TableRow homeTeamHomeTable, TableRow awayTeamAwayTable)
        //{
        //    homeTeamTable.Round += 1;
        //    homeTeamHomeTable.Round += 1;
        //    awayTeamTable.Round += 1;
        //    awayTeamAwayTable.Round += 1;

        //    homeTeamTable.GoalsFor += pendingMatch.HomeGoals;
        //    homeTeamHomeTable.GoalsFor += pendingMatch.HomeGoals;
        //    awayTeamTable.GoalsFor += pendingMatch.AwayGoals;
        //    awayTeamAwayTable.GoalsFor += pendingMatch.AwayGoals;

        //    homeTeamTable.GoalsAgainst += pendingMatch.AwayGoals;
        //    homeTeamHomeTable.GoalsAgainst += pendingMatch.AwayGoals;
        //    awayTeamTable.GoalsAgainst += pendingMatch.HomeGoals;
        //    awayTeamAwayTable.GoalsAgainst += pendingMatch.HomeGoals;

        //    homeTeamTable.GoalDiff = homeTeamTable.GoalsFor - homeTeamTable.GoalsAgainst;
        //    homeTeamHomeTable.GoalDiff = homeTeamHomeTable.GoalsFor - homeTeamHomeTable.GoalsAgainst;
        //    awayTeamTable.GoalDiff = awayTeamTable.GoalsFor - awayTeamTable.GoalsAgainst;
        //    awayTeamAwayTable.GoalDiff = awayTeamAwayTable.GoalsFor - awayTeamAwayTable.GoalsAgainst;

        //    homeTeamTable.Wins += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 1 : 0);
        //    homeTeamTable.Draws += (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0);
        //    homeTeamTable.Losses += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 1 : 0);

        //    awayTeamTable.Wins += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 1 : 0);
        //    awayTeamTable.Draws += (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0);
        //    awayTeamTable.Losses += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 1 : 0);

        //    homeTeamHomeTable.Wins += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 1 : 0);
        //    homeTeamHomeTable.Draws += (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0);
        //    homeTeamHomeTable.Losses += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 1 : 0);

        //    awayTeamAwayTable.Wins += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 1 : 0);
        //    awayTeamAwayTable.Draws += (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0);
        //    awayTeamAwayTable.Losses += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 1 : 0);

        //    homeTeamTable.Points += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 3 : (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0));
        //    homeTeamHomeTable.Points += (pendingMatch.HomeGoals > pendingMatch.AwayGoals ? 3 : (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0));
        //    awayTeamTable.Points += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 3 : (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0));
        //    awayTeamAwayTable.Points += (pendingMatch.HomeGoals < pendingMatch.AwayGoals ? 3 : (pendingMatch.HomeGoals == pendingMatch.AwayGoals ? 1 : 0));
        //}

        //private IEnumerable<Match> CreateMatches(IEnumerable<Falyze.Data.Models.Match> pendingMatches, List<TableRow> table, List<TableRow> homeTable, List<TableRow> awayTable, Dictionary<int, string> teamNames)
        //{
        //    List<Match> analyzed = new List<Match>();
        //    foreach (var pendingMatch in pendingMatches)
        //    {

        //        if(pendingMatch.HomeTeamId == 163 || pendingMatch.AwayTeamId == 163)
        //        {
        //            var v = 1;
        //        }

        //        TableRow homeTeamTable = this.GetTableRow(table, pendingMatch.HomeTeamId, teamNames[pendingMatch.HomeTeamId]);
        //        TableRow homeTeamHomeTable = this.GetTableRow(homeTable, pendingMatch.HomeTeamId, teamNames[pendingMatch.HomeTeamId]);
        //        TableRow homeTeamAwayTable = this.GetTableRow(awayTable, pendingMatch.HomeTeamId, teamNames[pendingMatch.HomeTeamId]);
        //        TableRow awayTeamTable = this.GetTableRow(table, pendingMatch.AwayTeamId, teamNames[pendingMatch.AwayTeamId]);
        //        TableRow awayTeamHomeTable = this.GetTableRow(homeTable, pendingMatch.AwayTeamId, teamNames[pendingMatch.AwayTeamId]);
        //        TableRow awayTeamAwayTable = this.GetTableRow(awayTable, pendingMatch.AwayTeamId, teamNames[pendingMatch.AwayTeamId]);

        //        analyzed.Add(new Match
        //        {
        //            CountryId = pendingMatch.CountryId,
        //            SeasonId = pendingMatch.SeasonId,
        //            LeagueId = pendingMatch.LeagueId,
        //            Date = pendingMatch.Date,
        //            HomeTeamId = pendingMatch.HomeTeamId,
        //            AwayTeamId = pendingMatch.AwayTeamId,
        //            HomeTeam = teamNames[pendingMatch.HomeTeamId],
        //            AwayTeam = teamNames[pendingMatch.AwayTeamId],
        //            HomeGoals = pendingMatch.HomeGoals,
        //            AwayGoals = pendingMatch.AwayGoals,
        //            HomeTeamTable = homeTeamTable.Clone() as TableRow,
        //            AwayTeamTable = awayTeamTable.Clone() as TableRow,
        //            HomeTeamHomeTable = homeTeamHomeTable.Clone() as TableRow,
        //            AwayTeamHomeTable = awayTeamHomeTable.Clone() as TableRow,
        //            HomeTeamAwayTable = homeTeamAwayTable.Clone() as TableRow,
        //            AwayTeamAwayTable = awayTeamAwayTable.Clone() as TableRow
        //        });

        //        this.UpdateTableRows(pendingMatch, homeTeamHomeTable, awayTeamTable, homeTeamHomeTable, awayTeamAwayTable);
        //    }

        //    return analyzed;
        //}

        //private TableRow GetTableRow(List<TableRow> rows, int teamId, string teamName)
        //{
        //    TableRow row = rows.FirstOrDefault(r => r.TeamId == teamId);
        //    if(row == null)
        //    {
        //        row = new TableRow
        //        {
        //            TeamId = teamId,
        //            TeamName = teamName,
        //        };
        //        rows.Add(row);
        //    }
        //    return row;
        //}
    }
}
