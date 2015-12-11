using Falyze.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Business.Filter
{
    public class TeamFilter : Filter
    {
        public Guid TeamId { get; set; }

        public override bool Valid(Match match, Side side)
        {
            return side == Side.Home ? match.HomeTeamId == this.TeamId : match.AwayTeamId == this.TeamId;
        }
    }

    public abstract class RangeFilter : Filter
    {
        public int Min { get; set; }
        public int Max { get; set; }

        public abstract override bool Valid(Match match, Side side);

        protected bool Valid(int value)
        {
            return value >= this.Min && value <= this.Max;
        }
    }

    public class RoundFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Round + 1);
        }
    }

    public class PositionFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Position);
        }
    }

    public class PointsFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Points);
        }
    }

    public class GoalsForFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).GoalsFor);
        }
    }

    public class WinsFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Wins);
        }
    }

    public class Losses : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Losses);
        }
    }

    public class DrawsFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).Draws);
        }
    }

    public class GoalsAgainstFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).GoalsAgainst);
        }
    }

    public class GoalDiffFilter : RangeFilter
    {
        public override bool Valid(Match match, Side side)
        {
            return this.Valid(this.GetTableRow(match, side).GoalDiff);
        }
    }
}
