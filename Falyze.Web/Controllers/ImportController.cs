using Falyze.Business;
using Falyze.Data;
using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Falyze.Web.Controllers
{
    public class ImportController : Controller
    {
        // GET: Import
        public ActionResult Index()
        {
            BetterDatabase db = new BetterDatabase();
            var season = db.GetWhere<Season>(string.Format("StartYear = {0}", 2014));
            var teams = db.Get<Team>();
            var matches = db.GetWhere<Falyze.Data.Models.Match>(string.Format("SeasonId = '{0}'", season.First().Id));
            ITableBuilder tblBuilder = new TableBuilder(matches, teams);
            tblBuilder.AddMatches(matches);
            return View();
        }
    }
}