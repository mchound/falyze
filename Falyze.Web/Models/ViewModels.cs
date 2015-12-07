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

    public class TeamAliasClientModel
    {
        public Guid TeamId { get; set; }
        public string Alias { get; set; }
    }

    public class RawMatch
    {
        public DateTime Date { get; set; }
        public Guid HomeTeamId { get; set; }
        public Guid AwayTeamId { get; set; }
        public byte HomeTeamGoals { get; set; }
        public byte AwayTeamGoals { get; set; }
    }
}