using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    [RoutePrefix("api/admin/league")]
    public class LeagueController : EntityController<League>
    {
        [Route("{countryId:guid}")]
        [HttpGet]
        public override HttpResponseMessage Get(Guid countryId)
        {
            try
            {
                var leagues = db.Where<League>(string.Format("CountryId = '{0}'", countryId));
                return Success<IEnumerable<League>>(leagues);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
