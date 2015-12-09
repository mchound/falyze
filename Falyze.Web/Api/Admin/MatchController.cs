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
    public class MatchController : BaseApiController
    {
        [Route("{countryId:guid}/{leagueId:guid}/{seasonId:guid}")]
        [HttpPost]
        public HttpResponseMessage Post([FromUri]Guid countryId, [FromUri]Guid leagueId, [FromUri]Guid seasonId, [FromBody]IEnumerable<RawMatch> matches)
        {
            try
            {
                var converted = matches.Select(m => Converters.Match(m, countryId, leagueId, seasonId));
                db.Insert<Match>(converted);
                return Success<int>(converted.Count());
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
