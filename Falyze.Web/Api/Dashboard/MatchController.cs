using Falyze.Data.Models;
using Falyze.Web.Api.Admin;
using Falyze.Web.Helpers.ModelBinders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Falyze.Web.Api.Dashboard
{
    [RoutePrefix("api/dashboard/match")]
    public class MatchDashboardController : BaseApiController
    {
        [HttpGet]
        [Route("count")]
        public HttpResponseMessage Get([ModelBinder(typeof(EnumerableModelBinder))] IEnumerable<string> leagues, [ModelBinder(typeof(EnumerableModelBinder))] IEnumerable<string> seasons)
        {
            try
            {
                var query = string.Format(@"SELECT COUNT(*) FROM Matches WHERE LeagueId in ({0}) AND SeasonId in ({1})", string.Join(",", leagues.Select(l => string.Format("'{0}'", l))), string.Join(",", seasons.Select(s => string.Format("'{0}'", s))));
                return Success<int>(db.Count(query));
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
