using Falyze.Business;
using Falyze.Data.Models;
using Falyze.Web.Api.Admin;
using Falyze.Web.Helpers.ModelBinders;
using Falyze.Web.Models;
using Falyze.Business.Filter;
using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using RawMatch = Falyze.Data.Models.Match;
using Match = Falyze.Business.Match;

namespace Falyze.Web.Api.Dashboard
{
    [RoutePrefix("api/dashboard/stats")]
    public class StatsDashboardController : BaseApiController
    {
        [HttpPost]
        [Route("")]
        public HttpResponseMessage Get(FilterViewModel filter)
        {
            var rawMatches = db.Where<RawMatch>(string.Format("LeagueId IN {0} AND SeasonId IN {1}", filter.Leagues.ToInCollection<Guid>(), filter.Seasons.ToInCollection<Guid>()));
            var teams = db.Where<Team>(string.Format("CountryId = '{0}'", filter.Country));
            var matches = new List<Match>();

            foreach (var season in filter.Seasons)
            {
                var seasonMatches = rawMatches.Where(m => m.SeasonId == season);
                MatchBuilder matchBuilder = new MatchBuilder(seasonMatches, teams, new TableBuilder(seasonMatches, teams));
                matches.AddRange(matchBuilder.ProcessMatches());
            }

            var result = matches.Filter(filter.Team1, filter.Team2);

            try
            {
                return Success<FilterResult>(result);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
