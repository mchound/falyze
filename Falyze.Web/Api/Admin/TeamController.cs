using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    [RoutePrefix("api/admin/team")]
    public class TeamController : EntityController<Team>
    {
        [Route("{countryId:guid}")]
        [HttpGet]
        public override HttpResponseMessage Get(Guid countryId)
        {
            try
            {
                var teams = db.Where<Team>(string.Format("CountryId = '{0}'", countryId));
                return Success<IEnumerable<Team>>(teams);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
