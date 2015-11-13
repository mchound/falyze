using Falyze.Data.Models;
using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data
{
    public class Repository
    {
        Database _database;

        public Repository(Database database)
        {
            _database = database;
        }

        public IEnumerable<T> Get<T>() where T : Table, new()
        {
            return _database.Get<T>();
        }
        public IEnumerable<Country> GetCountries()
        {
            return _database.Get<Country>();
        }

        public IEnumerable<League> GetLeagues()
        {
            return _database.Get<League>();
        }

        public IEnumerable<Season> GetSeasons()
        {
            return _database.Get<Season>();
        }

        public IEnumerable<Team> GetTeams()
        {
            return _database.Get<Team>();
        }

        public IEnumerable<Match> GetMatches(Func<Match, bool> predicate)
        {
            return _database.Get<Match>().Where(predicate);
        }

        public IEnumerable<Match> GetMatches(int seasonId, int leagueId)
        {
            return _database.Get<Match>(string.Format("SeasonId={0} AND LeagueId={1}", seasonId, leagueId));
        }
    }
}
