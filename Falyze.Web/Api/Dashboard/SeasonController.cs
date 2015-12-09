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
    [RoutePrefix("api/dashboard/season")]
    public class SeasonDashboardController : BaseApiController
    {
        [Route("")]
        [HttpGet]
        public HttpResponseMessage Get()
        {
            try
            {
                return Success<IEnumerable<Season>>(db.Get<Season>());
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("byLeagues")]
        [HttpGet]
        public HttpResponseMessage Get([ModelBinder(typeof(EnumerableModelBinder))] IEnumerable<string> leagues)
        {
            try
            {
                var query = string.Format(@"SELECT DISTINCT
	                                            s.id, s.name, s.startyear 
                                            FROM 
                                            Matches m
	                                            INNER JOIN
		                                            Seasons s
	                                            on s.id = m.SeasonId
                                            WHERE
                                            leagueid in ({0})", string.Join(",", leagues.Select(l => string.Format("'{0}'", l))));
                return Success<IEnumerable<Season>>(db.Map<Season>(query));
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
