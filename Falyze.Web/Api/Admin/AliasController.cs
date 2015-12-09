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
        [Route("byTeam/{teamId:guid}")]
        [HttpGet]
        public HttpResponseMessage GetByTeam(Guid teamId)
        {
            try
            {
                var aliases = db.Where<TeamAlias>(string.Format("TeamId = '{0}'", teamId));
                return Success<IEnumerable<TeamAlias>>(aliases);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("byCountry/{countryId:guid}")]
        [HttpGet]
        public HttpResponseMessage GetByCountry(Guid countryId)
        {
            string sql = @"select a.id, a.teamid, a.alias from Teams t
                            inner join TeamAliases a on a.teamid = t.id
                            where t.countryid = '{0}'";

            try
            {
                var aliases = db.Map<TeamAlias>(string.Format(sql, countryId));
                return Success<IEnumerable<TeamAlias>>(aliases);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
