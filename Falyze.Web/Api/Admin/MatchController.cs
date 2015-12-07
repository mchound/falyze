using Falyze.Data.Models;
using Falyze.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    [RoutePrefix("api/admin/match")]
    public class MatchController : BaseAdminController
    {
        [Route("{countryId:guid}/{leagueId:guid}/{seasonId:guid}")]
        [HttpPost]
        public HttpResponseMessage Post([FromUri]Guid countryId, [FromUri]Guid leagueId, [FromUri]Guid seasonId, [FromBody]IEnumerable<RawMatch> matches)
        {
            try
            {
                //var teams = db.GetWhere<Team>(string.Format("CountryId = '{0}'", countryId));
                return Success<int>(10);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
