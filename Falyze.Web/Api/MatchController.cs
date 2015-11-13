using Falyze.Cache;
using Falyze.Data;
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
    public class MatchController : ApiController
    {
        //[HttpGet]
        //[Route("api/match/count/{countryId}")]
        //public HttpResponseMessage Count(int countryId, [ModelBinder(typeof(EnumerableModelBinder))]IEnumerable<string> leagueIds, [ModelBinder(typeof(EnumerableModelBinder))]IEnumerable<string> seasonIds)
        //{
        //    var leagues = leagueIds.Select(id => int.Parse(id));
        //    var seasons = seasonIds.Select(id => int.Parse(id));
        //    StatisticsService service = new StatisticsService(new Repository(new BetterDatabase()), new StatisticManager(), new CacheService());
        //    var matches = service.GetMatches(seasons, leagues);
        //    return Request.CreateResponse<object>(HttpStatusCode.OK, new { count = matches.Count() });
        //}
    }
}
