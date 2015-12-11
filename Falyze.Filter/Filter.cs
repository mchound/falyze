using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Falyze.Filter
{
    public interface IFilter
    {
        Side Table { get; set; }
        bool Valid(Match match, Side side);
    }

    public abstract class Filter : IFilter
    {
        public Side Table { get; set; }

        public abstract bool Valid(Match match, Side side);

        protected TableRow GetTableRow(Match match, Side side)
        {
            if (side == Side.Neutral)
            {
                throw new ArgumentException("Side cannot be neutral when filtering", "side");
            }

            switch (this.Table)
            {
                case Side.Home:
                    return side == Side.Home ? match.HomeTeamHomeTable : match.AwayTeamHomeTable;
                case Side.Away:
                    return side == Side.Home ? match.HomeTeamAwayTable : match.AwayTeamAwayTable;
                default:
                    return side == Side.Home ? match.HomeTeamTable : match.AwayTeamTable;
            }
        }
    }
}
