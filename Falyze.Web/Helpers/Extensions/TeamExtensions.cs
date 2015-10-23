using Falyze.Data.Models;
using Falyze.Statistics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Falyze.Web.Helpers.Extensions
{
    public static class TeamExtensions
    {
        public static IEnumerable<Team> ExtractTeams(this IEnumerable<Falyze.Statistics.Match> matches)
        {
            HashSet<Team> teams = new HashSet<Team>();
            foreach (var match in matches)
            {
                if(!teams.Any(t => t.Id == match.HomeTeamId))
                {
                    teams.Add(new Team { Id = match.HomeTeamId, Name = match.HomeTeam });
                }
                if (!teams.Any(t => t.Id == match.AwayTeamId))
                {
                    teams.Add(new Team { Id = match.AwayTeamId, Name = match.AwayTeam });
                }
            }
            return teams;
        }
    }
}