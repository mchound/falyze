using Falyze.Cache;
using Falyze.Data;
using Falyze.Statistics;
using Falyze.Web.Helpers.Extensions;
using Falyze.Web.Helpers.ModelBinders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Falyze.Web.Api
{
    public class StatsController : ApiController
    {
        [HttpGet]
        [Route("api/stats/team/{team1}/{team2}")]
        public HttpResponseMessage Get(int team1, int team2)
        {
            StatisticsService service = new StatisticsService(new Repository(), new StatisticManager(), new CacheService());
            return Request.CreateResponse<object>(HttpStatusCode.OK, new {
                team1 = team1 == -1 ? null : new {tables = service.GetCurrentTableForTeam(team1), matches = service.GetMatchesForTeam(team1) },
                team2 = team2 == -1 ? null : new { tables = service.GetCurrentTableForTeam(team2), matches = service.GetMatchesForTeam(team2) },
                vs = team1 > -1 && team2 > -1 ? new {test = 12, test2 = 12} : null
            });
        }
    }
}
