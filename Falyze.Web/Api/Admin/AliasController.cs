using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    [RoutePrefix("api/admin/alias")]
    public class AliasController : EntityController<TeamAlias>
    {
        [Route("{teamId:guid}")]
        [HttpGet]
        public override HttpResponseMessage Get(Guid teamId)
        {
            try
            {
                var aliases = db.GetWhere<TeamAlias>(string.Format("TeamId = '{0}'", teamId));
                return Success<IEnumerable<TeamAlias>>(aliases);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
