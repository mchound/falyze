using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Business.Filter
{
    public class FilterResult
    {
        public List<Match> Matches { get; set; }
        public int Team1Wins { get; set; }
        public int Team2Wins { get; set; }
        public int Draws { get; set; }
    }
}
