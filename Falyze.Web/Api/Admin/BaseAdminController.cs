using Falyze.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    public class BaseAdminController : ApiController
    {
        protected BetterDatabase db;
             
        public BaseAdminController()
        {
            db = new BetterDatabase();
        }

        protected HttpResponseMessage Success<T>(T response)
        {
            return Request.CreateResponse<T>(HttpStatusCode.OK, response);
        }

        protected HttpResponseMessage Error(HttpStatusCode status, string errorMessage)
        {
            return Request.CreateResponse<string>(status, errorMessage);
        }
    }
}
