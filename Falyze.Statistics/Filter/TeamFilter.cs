using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Statistics.Filter
{
    public class TeamFilters
    {
        public Side Side { get; set; }
        public TeamFilter TeamFilter { get; set; }
        public RoundFilter RoundFilter { get; set; }
        public GoalsForFilter GoalsForFilter { get; set; }
        public PointsFilter PointsFilter { get; set; }

        public IEnumerable<IFilter> GetFilters()
        {
            return new IFilter[] { this.TeamFilter, this.RoundFilter, this.GoalsForFilter, this.PointsFilter };
        }
    }
}
