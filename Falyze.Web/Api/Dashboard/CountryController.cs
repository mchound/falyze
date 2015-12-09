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
    [RoutePrefix("api/dashboard/country")]
    public class CountryDashboardController : BaseApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage Get()
        {
            try
            {
                return Success<IEnumerable<Country>>(db.Get<Country>());
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
