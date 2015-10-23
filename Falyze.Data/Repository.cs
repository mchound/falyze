using Falyze.Data.DbConnector;
using Falyze.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data
{
    public class Repository
    {
        public IEnumerable<T> Get<T>() where T : DbTable, new()
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<T>();
        }
        public IEnumerable<Country> GetCountries()
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<Country>();
        }

        public IEnumerable<League> GetLeagues()
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<League>();
        }

        public IEnumerable<Season> GetSeasons()
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<Season>();
        }

        public IEnumerable<Team> GetTeams()
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<Team>();
        }

        public IEnumerable<Match> GetMatches(Func<Match, bool> predicate)
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<Match>().Where(predicate);
        }

        public IEnumerable<Match> GetMatches(int seasonId, int leagueId)
        {
            BetterDatabase db = new BetterDatabase();
            return db.Get<Match>(string.Format("SeasonId={0} AND LeagueId={1}", seasonId, leagueId));
        }
    }
}
