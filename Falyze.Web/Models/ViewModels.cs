using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Falyze.Web.Models
{
    public class RawMatch
    {
        public DateTime Date { get; set; }
        public Guid HomeTeamId { get; set; }
        public Guid AwayTeamId { get; set; }
        public byte HomeGoals { get; set; }
        public byte AwayGoals { get; set; }
    }
}