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
    [RoutePrefix("api/dashboard/league")]
    public class LeagueDashboardController : BaseApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage Get()
        {
            try
            {
                return Success<IEnumerable<League>>(db.Get<League>());
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("byCountry/{countryId:guid}")]
        public HttpResponseMessage Get(Guid countryId)
        {
            try
            {
                return Success<IEnumerable<League>>(db.Where<League>(string.Format("CountryId = '{0}'", countryId)));
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
