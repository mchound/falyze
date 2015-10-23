using Falyze.Cache;
using Falyze.Data;
using Falyze.Data.DbConnector;
using Falyze.Statistics;
using Falyze.Statistics.Filter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Falyze.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
