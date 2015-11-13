using Falyze.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Statistics.Filter
{
    public static class FilterExtensions
    {
        public static IEnumerable<Match> Filter(this IEnumerable<Match> matches, TeamFilters team1, TeamFilters team2)
        {
            return matches.Where(m => m.ValidateMatch(team1, team2));
        }

        public static bool ValidateMatch(this Match match, TeamFilters team1, TeamFilters team2)
        {
            if (team1.Side == Side.Neutral)
            {
                return (team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away)) || (team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home));
            }
            else if (team1.Side == Side.Home)
            {
                return team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away);
            }
            else
            {
                return team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home);
            }
        }

        private static bool ValidateTeam(this TeamFilters teamFilter, Match match, Side side)
        {
            foreach (var filter in teamFilter.GetFilters())
            {
                if (filter != null && !filter.Valid(match, side))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
