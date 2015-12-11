using Falyze.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Business.Filter
{
    public static class FilterExtensions
    {
        public static FilterResult Filter(this IEnumerable<Match> matches, TeamFilters team1, TeamFilters team2)
        {
            FilterResult result = new FilterResult();
            result.Matches = new List<Match>();
            foreach (var match in matches)
            {
                if(team1.Side == Side.Neutral)
                {
                    bool team1Home = team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away);
                    bool team1Away = team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home);
                    if((team1Home && team1Away) || (!team1Home && !team1Away))
                    {
                        continue;
                    }
                    else if(team1Home && !team1Away)
                    {
                        result.Matches.Add(match);
                        result.Team1Wins += match.HomeGoals > match.AwayGoals ? 1 : 0;
                        result.Team2Wins += match.HomeGoals < match.AwayGoals ? 1 : 0;
                        result.Draws += match.HomeGoals == match.AwayGoals ? 1 : 0;
                    }
                    else if(team1Away)
                    {
                        result.Matches.Add(match);
                        result.Team1Wins += match.HomeGoals < match.AwayGoals ? 1 : 0;
                        result.Team2Wins += match.HomeGoals > match.AwayGoals ? 1 : 0;
                        result.Draws += match.HomeGoals == match.AwayGoals ? 1 : 0;
                    }
                }
                else if(team1.Side == Side.Home && team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away))
                {
                    result.Matches.Add(match);
                    result.Team1Wins += match.HomeGoals > match.AwayGoals ? 1 : 0;
                    result.Team2Wins += match.HomeGoals < match.AwayGoals ? 1 : 0;
                    result.Draws += match.HomeGoals == match.AwayGoals ? 1 : 0;
                }
                else if(team1.Side == Side.Away && team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home))
                {
                    result.Matches.Add(match);
                    result.Team1Wins += match.HomeGoals < match.AwayGoals ? 1 : 0;
                    result.Team2Wins += match.HomeGoals > match.AwayGoals ? 1 : 0;
                    result.Draws += match.HomeGoals == match.AwayGoals ? 1 : 0;
                }
            }

            return result;
        }

        //private static bool ValidateMatch(this Match match, TeamFilters team1, TeamFilters team2)
        //{
        //    if (team1.Side == Side.Neutral)
        //    {
        //        return (team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away)) || (team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home));
        //    }
        //    else if (team1.Side == Side.Home)
        //    {
        //        return team1.ValidateTeam(match, Side.Home) && team2.ValidateTeam(match, Side.Away);
        //    }
        //    else
        //    {
        //        return team1.ValidateTeam(match, Side.Away) && team2.ValidateTeam(match, Side.Home);
        //    }
        //}

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
