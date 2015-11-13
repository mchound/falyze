using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Falyze.Web.Models
{
    public class Filter
    {
        public string Title { get; set; }
        public string FilterName { get; set; }
    }

    public class TeamAnalyzerModel
    {
        public IEnumerable<string> TeamNames { get; set; }
        public Guid CountryId { get; set; }
    }
}