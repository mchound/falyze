using Falyze.Cache;
using Falyze.Data;
using Falyze.Data.DbConnector;
using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Statistics
{
    public interface IStatisticsService
    {
        IEnumerable<Match> GetMatches(int seasonId, int leagueId);
        IEnumerable<Match> GetMatches(IEnumerable<int> seasonIds, IEnumerable<int> leagueIds);
        IEnumerable<T> Get<T>() where T : DbTable, new();
        IEnumerable<Country> GetCountries();
        IEnumerable<Season> GetSeasons();
        IEnumerable<League> GetLeagues();
        IEnumerable<Team> GetTeams();
        TableSet GetTable(int seasonId, int leagueId);
        TableSet GetCurrentTableForTeam(int teamId);
        IEnumerable<Match> GetMatchesForCountry(int countryId);
        IEnumerable<Match> GetMatchesForTeam(int teamId, int seasonId = -1);
    }

    public class StatisticsService : IStatisticsService
    {
        private Repository _repository;
        private StatisticManager _statisticManager;
        private ICacheService _cacheService;

        public StatisticsService(Repository repository, StatisticManager statisticManager, ICacheService cacheService)
        {
            _repository = repository;
            _statisticManager = statisticManager;
            _cacheService = cacheService;
        }

        public IEnumerable<T> Get<T>() where T : DbTable, new()
        {
            IEnumerable<T> entities = _cacheService.Get<IEnumerable<T>>();
            if(entities == null)
            {
                entities = _repository.Get<T>();
                _cacheService.Add<IEnumerable<T>>(entities);
            }
            return entities;
        }

        public IEnumerable<Match> GetMatches(int seasonId, int leagueId)
        {
            IEnumerable<Match> matches = _cacheService.Get<IEnumerable<Match>>(seasonId, leagueId);
            if(matches == null)
            {
                var rawMatches = _repository.GetMatches(seasonId, leagueId).ToList();
                var teams = this.GetTeams();
                matches = _statisticManager.BuildMatches(rawMatches, teams);
                

                _cacheService.Add<IEnumerable<Match>>(seasonId, leagueId, matches);
            }
            return matches;
        }

        public IEnumerable<Match> GetMatches(IEnumerable<int> seasonIds, IEnumerable<int> leagueIds)
        {
            List<Match> matches = new List<Match>();
            foreach (var season in seasonIds)
            {
                foreach (var league in leagueIds)
                {
                    matches.AddRange(GetMatches(season, league));
                }
            }

            return matches;
        }

        public IEnumerable<Country> GetCountries()
        {
            return this.Get<Country>();
        }

        public IEnumerable<Season> GetSeasons()
        {
            return this.Get<Season>();
        }

        public IEnumerable<League> GetLeagues()
        {
            return this.Get<League>();
        }

        public IEnumerable<Team> GetTeams()
        {
            return this.Get<Team>();
        }

        public TableSet GetCurrentTableForTeam(int teamId)
        {
            Match lastDateMatch = this.GetLastMatch(teamId);
            Season season = this.GetSeasons().First(s => s.Id == lastDateMatch.SeasonId);
            League league = this.GetLeagues().First(l => l.Id == lastDateMatch.LeagueId);
            return this.GetTable(season.Id, league.Id);
        }

        public TableSet GetTable(int seasonId, int leagueId)
        {
            TableSet tableSet = _cacheService.Get<TableSet>(seasonId, leagueId);
            if (tableSet == null)
            {
                var matches = this.GetMatches(seasonId, leagueId);
                tableSet = _statisticManager.BuildTableSet(matches, this.GetTeams());
                _cacheService.Add<TableSet>(seasonId, leagueId, tableSet);
            }
            return tableSet;
        }

        public IEnumerable<Match> GetMatchesForCountry(int countryId)
        {
            var seasons = this.GetSeasons().Where(s => s.CountryId == countryId).Select(s => s.Id);
            var leagues = this.GetLeagues().Where(l => l.CountryId == countryId).Select(l => l.Id);
            return this.GetMatches(seasons, leagues);
        }

        /// <summary>
        /// Get matches for a specific team.
        /// </summary>
        /// <param name="teamId">Team Id</param>
        /// <param name="seasonId">Season Id. Specify -1 or leave season empty for 38 latest matches</param>
        /// <returns></returns>
        public IEnumerable<Match> GetMatchesForTeam(int teamId, int seasonId = -1)
        {
            IEnumerable<Match> matches;
            if(seasonId == -1)
            {
                Team team = this.GetTeams().First(t => t.Id == teamId);
                matches = this.GetMatchesForCountry(team.CountryId);
            }
            else
            {
                matches = this.GetMatches(new int[] { seasonId }, this.GetLeagues().Select(l => l.Id));
            }
            return matches.Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId).OrderByDescending(m => m.Date).Take(50);
        }

        private Match GetLastMatch(int teamId)
        {
            Team team = this.GetTeams().First(t => t.Id == teamId);
            return this.GetMatchesForCountry(team.CountryId).Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId).Aggregate((m1, m2) => m1.Date > m2.Date ? m1 : m2);
        }
    }
}
