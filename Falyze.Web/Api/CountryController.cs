using Falyze.Cache;
using Falyze.Data;
using Falyze.Statistics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace Falyze.Web.Api
{
    public class CountryController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            StatisticsService service = new StatisticsService(new Repository(), new StatisticManager(), new CacheService());
            return Request.CreateResponse<IEnumerable<Falyze.Data.Models.Country>>(HttpStatusCode.OK, service.GetCountries());
        }
    }
}
