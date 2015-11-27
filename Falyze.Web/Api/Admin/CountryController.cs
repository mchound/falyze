using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    [RoutePrefix("api/admin/country")]
    public class CountryController : EntityController<Country>
    {
        //[Route("")]
        //[HttpGet]
        //public virtual HttpResponseMessage Get()
        //{
        //    Data.BetterDatabase db = new Data.BetterDatabase();
        //    try
        //    {
        //        IEnumerable<Country> entities = db.Get<Country>();
        //        return Request.CreateResponse<IEnumerable<Country>>(entities);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
        //    }
        //}

        //[Route("{id:guid}")]
        //[HttpDelete]
        //public HttpResponseMessage Delete(Guid id)
        //{
        //    return Request.CreateResponse<string>("Test");
        //}
    }
}
