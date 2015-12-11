using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Business.Filter
{
    public class TeamFilters
    {
        public Side Side { get; set; }
        public TeamFilter TeamFilter { get; set; }
        public PositionFilter PositionFilter { get; set; }
        public RoundFilter RoundFilter { get; set; }
        public GoalsForFilter GoalsForFilter { get; set; }
        public GoalsAgainstFilter GoalsAganstFilter { get; set; }
        public GoalDiffFilter GoalDiffFilter { get; set; }
        public PointsFilter PointsFilter { get; set; }

        public IEnumerable<IFilter> GetFilters()
        {
            return new IFilter[] { this.TeamFilter, this.PositionFilter, this.RoundFilter, this.GoalsForFilter, this.GoalsAganstFilter, this.GoalDiffFilter, this.PointsFilter };
        }
    }
}
