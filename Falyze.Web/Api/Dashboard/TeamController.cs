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
    [RoutePrefix("api/dashboard/team")]
    public class TeamDashboardController : BaseApiController
    {
        [HttpGet]
        [Route("{countryId:guid}")]
        public HttpResponseMessage Get(Guid countryId)
        {
            try
            {
                return Success<IEnumerable<Team>>(db.Where<Team>(string.Format("CountryId = '{0}'", countryId)));
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("")]
        public HttpResponseMessage Get([ModelBinder(typeof(EnumerableModelBinder))] IEnumerable<string> leagues, [ModelBinder(typeof(EnumerableModelBinder))] IEnumerable<string> seasons)
        {
            try
            {
                var query = string.Format(@"SELECT DISTINCT
                                                t.id, t.name, t.countryId
                                            FROM Matches m
                                                INNER JOIN
                                                    Teams t
                                                ON m.HomeTeamId = t.id
                                            WHERE
                                                m.leagueid in ({0})
            	                                    AND
                                                m.SeasonId in ({1})", 
                                                string.Join(",", leagues.Select(l => string.Format("'{0}'", l))),
                                                string.Join(",", seasons.Select(s => string.Format("'{0}'", s)))
                                            );
                return Success<IEnumerable<Team>>(db.Map<Team>(query));
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
