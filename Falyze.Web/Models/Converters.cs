using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Falyze.Web.Models
{
    public static class Converters
    {
        public static Data.Models.Match Match(RawMatch match, Guid seasonId)
        {
            return new Data.Models.Match
            {
                Id = Guid.NewGuid(),
                Date = match.Date,
                Key = string.Concat(match.Date.ToString("yyyy-MM-dd"), match.HomeTeamId),
                CountryId = match.CountryId,
                SeasonId = seasonId,
                HomeTeamId = match.HomeTeamId,
                AwayTeamId = match.AwayTeamId,
                LeagueId = match.LeagueId,
                AwayGoals = match.AwayTeamGoals,
                HomeGoals = match.HomeTeamGoals
            };
        }
    }
}