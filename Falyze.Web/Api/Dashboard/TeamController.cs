using Falyze.Data.Models;
using Falyze.Web.Api.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

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
    }
}
