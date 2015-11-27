//using Falyze.Data;
//using Falyze.Data.Models;
//using Falyze.Web.Models;
//using System;
//using System.Collections.Generic;
//using System.Diagnostics;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Threading;
//using System.Web.Http;

//namespace Falyze.Web.Api
//{
//    [RoutePrefix("api/import")]
//    public class ImportController : ApiController
//    {
//        BetterDatabase _db;

//        public ImportController()
//        {
//            _db = new BetterDatabase();
//        }

//        [HttpGet]
//        [Route("country/{countryName}")]
//        public HttpResponseMessage GetCountry(string countryName)
//        {
//            var country = _db.Get<Country>(string.Format("name = '{0}'", countryName)).FirstOrDefault();
//            if(country == null)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.NotFound, null);
//            }
//            return Request.CreateResponse<object>(HttpStatusCode.OK, country);
//        }

//        [HttpPost]
//        [Route("country/{countryName}")]
//        public HttpResponseMessage SaveCountry([FromUri]string countryName)
//        {
//            var country = new Country { Id = Guid.NewGuid(), Name = countryName };
//            try
//            {
//                _db.Insert<Country>(country);
//                return Request.CreateResponse<Country>(HttpStatusCode.OK, country);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }


//        [HttpGet]
//        [Route("league/{countryId}")]
//        public HttpResponseMessage GetLeagues(string countryId)
//        {
//            var leagues = _db.Get<League>(string.Format("countryId = '{0}'", countryId));
//            return Request.CreateResponse<object>(HttpStatusCode.OK, leagues);
//        }

//        [HttpPost]
//        [Route("league/{countryId:guid}/{leagueName}/{level}")]
//        public HttpResponseMessage SaveLeague([FromUri]Guid countryId, [FromUri]string leagueName, [FromUri]int level)
//        {
//            var league = new League { Id = Guid.NewGuid(), Name = leagueName, CountryId = countryId, Level = level};
//            try
//            {
//                _db.Insert<League>(league);
//                return Request.CreateResponse<League>(HttpStatusCode.OK, league);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        [HttpGet]
//        [Route("team/{countryId}")]
//        public HttpResponseMessage GetTeams(string countryId)
//        {
//            var teams = _db.Get<Team>(string.Format("countryId = '{0}'", countryId));
//            var aliases = _db.Get<TeamAlias>("TeamId", teams.Select(t => t.Id.ToString()));
//            return Request.CreateResponse<object>(HttpStatusCode.OK, new { teams = teams, aliases = aliases});
//        }

//        [HttpPost]
//        [Route("team/{teamName}/{countryId:guid}")]
//        public HttpResponseMessage CreateTeam([FromUri]string teamName, [FromUri]Guid countryId)
//        {
//            var team = new Team { Id = Guid.NewGuid(), Name = teamName.Replace("'", "''"), CountryId = countryId };
//            try
//            {
//                _db.Insert<Team>(team);
//                return Request.CreateResponse<object>(HttpStatusCode.OK, team);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        [HttpPut]
//        [Route("team/rename/{id:guid}/{teamName}")]
//        public HttpResponseMessage RenameTeam([FromUri]Guid id, [FromUri]string teamName)
//        {
//            var current = _db.Get<Team>(id);
//            current.Name = teamName.Replace("'", "''");
//            try
//            {
//                _db.Update<Team>(current);
//                return Request.CreateResponse<object>(HttpStatusCode.OK, current);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        [HttpDelete]
//        [Route("team/{id:guid}")]
//        public HttpResponseMessage Delete(Guid id)
//        {
//            try
//            {
//                _db.Delete<Team>(id);
//                return Request.CreateResponse<object>(HttpStatusCode.OK, id);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        [HttpPost]
//        [Route("team/alias")]
//        public HttpResponseMessage CreateAlias(TeamAliasClientModel model)
//        {
//            var alias = new TeamAlias { Id = Guid.NewGuid(), TeamId = model.TeamId, Alias = model.Alias.Replace("'", "''") };
//            try
//            {
//                _db.Insert<TeamAlias>(alias);
//                return Request.CreateResponse<object>(HttpStatusCode.OK, alias);
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        [HttpPost]
//        [Route("match")]
//        public HttpResponseMessage CreateMatches(IEnumerable<RawMatch> matches)
//        {
//            int startYear = matches.Min(m => m.Date.Year);
//            var season = _db.Get<Season>(string.Format("StartYear = {0}", startYear)).FirstOrDefault();

//            if(season == null)
//            {
//                season = _db.Insert<Season>(new Season
//                {
//                    Id = Guid.NewGuid(),
//                    Name = "Season",
//                    StartYear = startYear
//                });
//            }
//            try
//            {
//                var created = _db.Insert<Match>(matches.Select(m => Converters.Match(m, season.Id)));
//                return Request.CreateResponse<object>(HttpStatusCode.OK, created.Count());
//            }
//            catch (Exception ex)
//            {
//                return Request.CreateResponse<object>(HttpStatusCode.InternalServerError, new { ErrorMessage = ex.Message });
//            }
//        }

//        protected override void Dispose(bool disposing)
//        {
//            _db.Dispose();
//            base.Dispose(disposing);
//        }
//    }
//}
