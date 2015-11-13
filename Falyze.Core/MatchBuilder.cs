using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Falyze.Data.Models;

using RawMatch = Falyze.Data.Models.Match;

namespace Falyze.Business
{
    public interface IMatchBuilder
    {

    }

    public class MatchBuilder : IMatchBuilder
    {
        ITableBuilder _tableBuilder;
        IEnumerable<RawMatch> _matches;
        IEnumerable<Team> _teams;

        public MatchBuilder(IEnumerable<RawMatch> matches, IEnumerable<Team> teams, ITableBuilder tableBuilder)
        {
            _matches = matches ?? Enumerable.Empty<RawMatch>();
            _teams = teams;
            _tableBuilder = tableBuilder;
        }

        public IEnumerable<Match> ProcessMatches()
        {
            foreach (var match in _matches)
            {
                yield return new Match
                {
                    CountryId = match.CountryId,
                    SeasonId = match.SeasonId,
                    LeagueId = match.LeagueId,
                    Date = match.Date,
                    HomeTeamId = match.HomeTeamId,
                    AwayTeamId = match.AwayTeamId,
                    HomeTeam = _teams.First(t => t.Id == match.HomeTeamId).Name,
                    AwayTeam = _teams.First(t => t.Id == match.AwayTeamId).Name,
                    HomeGoals = match.HomeGoals,
                    AwayGoals = match.AwayGoals,
                    HomeTeamTable = _tableBuilder.GetTableRowCopyForTeam(match.HomeTeamId, MatchSide.Neutral),
                    AwayTeamTable = _tableBuilder.GetTableRowCopyForTeam(match.AwayTeamId, MatchSide.Neutral),
                    HomeTeamHomeTable = _tableBuilder.GetTableRowCopyForTeam(match.HomeTeamId, MatchSide.Home),
                    AwayTeamHomeTable = _tableBuilder.GetTableRowCopyForTeam(match.AwayTeamId, MatchSide.Home),
                    HomeTeamAwayTable = _tableBuilder.GetTableRowCopyForTeam(match.HomeTeamId, MatchSide.Away),
                    AwayTeamAwayTable = _tableBuilder.GetTableRowCopyForTeam(match.AwayTeamId, MatchSide.Away)
                };

                _tableBuilder.AddMatch(match);
            }
        }
    }
}
