using Falyze.Data;
using Falyze.Data.Models;
using Falyze.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace Falyze.Web.Api
{
    [RoutePrefix("api/import")]
    public class ImportController : ApiController
    {
        [HttpGet]
        [Route("country/{countryName}")]
        public HttpResponseMessage GetCountry(string countryName)
        {
            var db = new BetterDatabase();
            var country = db.Get<Country>(string.Format("name = '{0}'", countryName)).FirstOrDefault();
            if(country == null)
            {
                return Request.CreateResponse<object>(HttpStatusCode.NotFound, null);
            }
            return Request.CreateResponse<object>(HttpStatusCode.OK, country);
        }

        [HttpPost]
        [Route("country/{countryName}")]
        public HttpResponseMessage SaveCountry([FromUri]string countryName)
        {
            var db = new BetterDatabase();
            var country = new Country { Id = Guid.NewGuid(), Name = countryName };
            try
            {
                db.Insert<Country>(country);
                return Request.CreateResponse<Country>(HttpStatusCode.OK, country);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
            }
        }


        [HttpGet]
        [Route("league/{countryId}")]
        public HttpResponseMessage GetLeagues(string countryId)
        {
            var db = new BetterDatabase();
            var leagues = db.Get<League>(string.Format("countryId = '{0}'", countryId));
            return Request.CreateResponse<object>(HttpStatusCode.OK, leagues);
        }

        [HttpPost]
        [Route("league/{countryId:guid}/{leagueName}/{level}")]
        public HttpResponseMessage SaveLeague([FromUri]Guid countryId, [FromUri]string leagueName, [FromUri]int level)
        {
            var db = new BetterDatabase();
            var league = new League { Id = Guid.NewGuid(), Name = leagueName, CountryId = countryId, Level = level};
            try
            {
                db.Insert<League>(league);
                return Request.CreateResponse<League>(HttpStatusCode.OK, league);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
            }
        }

        [HttpGet]
        [Route("team/{countryId}")]
        public HttpResponseMessage GetTeams(string countryId)
        {
            var db = new BetterDatabase();
            var teams = db.Get<Team>(string.Format("countryId = '{0}'", countryId));
            var aliases = db.Get<TeamAlias>("TeamId", teams.Select(t => t.Id.ToString()));
            return Request.CreateResponse<object>(HttpStatusCode.OK, new { teams = teams, aliases = aliases});
        }

        [HttpPost]
        [Route("team/{teamName}/{countryId:guid}")]
        public HttpResponseMessage CreateTeam([FromUri]string teamName, [FromUri]Guid countryId)
        {
            var team = new Team { Id = Guid.NewGuid(), Name = teamName, CountryId = countryId };
            var db = new BetterDatabase();
            try
            {
                db.Insert<Team>(team);
                return Request.CreateResponse<object>(HttpStatusCode.OK, team);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
            }
        }

        [HttpPut]
        [Route("team/rename/{id:guid}/{teamName}")]
        public HttpResponseMessage RenameTeam([FromUri]Guid id, [FromUri]string teamName)
        {
            var db = new BetterDatabase();
            var current = db.Get<Team>(id);
            current.Name = teamName;
            try
            {
                db.Update<Team>(current);
                return Request.CreateResponse<object>(HttpStatusCode.OK, current);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
            }
        }

        [HttpDelete]
        [Route("team/{id:guid}")]
        public HttpResponseMessage Delete(Guid id)
        {
            var db = new BetterDatabase();
            try
            {
                db.Delete<Team>(id);
                return Request.CreateResponse<object>(HttpStatusCode.OK, id);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
            }
        }
    }
}
