using DataMigration.Data.V2;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigration
{
    class Program
    {
        static void Main(string[] args)
        {
            Data.V1.Better_Database_v1 old = new Data.V1.Better_Database_v1();
            Data.V2.Better_Database_v2 newDb = new Better_Database_v2();
            List<Season> seasons = newDb.Seasons.ToList();
            List<Team> teams = newDb.Teams.ToList();
            List<League> leagues = newDb.Leagues.ToList();
            HashSet<string> keys = new HashSet<string>();

            DataTable matches = new DataTable("Matches");
            matches.Columns.Add(new DataColumn("Id", typeof(Int32)));
            matches.Columns.Add(new DataColumn("Key", typeof(string)));
            matches.Columns.Add(new DataColumn("Date", typeof(DateTime)));
            matches.Columns.Add(new DataColumn("HomeTeamId", typeof(Int32)));
            matches.Columns.Add(new DataColumn("AwayTeamid", typeof(Int32)));
            matches.Columns.Add(new DataColumn("SeasonId", typeof(Int32)));
            matches.Columns.Add(new DataColumn("LeagueId", typeof(Int32)));
            matches.Columns.Add(new DataColumn("CountryId", typeof(Int32)));
            matches.Columns.Add(new DataColumn("homeGoals", typeof(byte)));
            matches.Columns.Add(new DataColumn("Awaygoals", typeof(byte)));

            var rawMatches = old.RawMatches.ToList();
            int counter = 0;
            foreach (var rawMatch in rawMatches)
            {
                var startYear2digits = int.Parse(rawMatch.Season.Substring(0, 2));
                var startYear = startYear2digits > 90 ? startYear2digits + 1900 : startYear2digits + 2000;
                var country = newDb.Countries.First(c => c.Name == rawMatch.Country);
                var season = seasons.FirstOrDefault(s => s.CountryId == country.Id && s.StartYear == startYear);

                if(season == null)
                {
                    season = new Season
                    {
                        CountryId = country.Id,
                        StartYear = startYear,
                        Name = string.Format("Season {0}/{1}", startYear2digits, startYear2digits + 1)
                    };
                    seasons.Add(season);
                    newDb.Seasons.Add(season);
                    newDb.SaveChanges();
                }

                var league = leagues.FirstOrDefault(l => l.CountryId == country.Id && l.Level == rawMatch.Level);

                if(league == null)
                {
                    league = new League
                    {
                        CountryId = country.Id,
                        Level = (byte)rawMatch.Level,
                        Name = "Not set"
                    };
                    leagues.Add(league);
                    newDb.Leagues.Add(league);
                    newDb.SaveChanges();
                }

                var homeTeam = teams.FirstOrDefault(t => t.Name == rawMatch.HomeTeam);

                if(homeTeam == null)
                {
                    homeTeam = new Team
                    {
                        Name = rawMatch.HomeTeam,
                        CountryId = country.Id
                    };
                    teams.Add(homeTeam);
                    newDb.Teams.Add(homeTeam);
                    newDb.SaveChanges();
                }
                
                var awayTeam = teams.FirstOrDefault(t => t.Name == rawMatch.AwayTeam);

                if (awayTeam == null)
                {
                    awayTeam = new Team
                    {
                        Name = rawMatch.AwayTeam,
                        CountryId = country.Id
                    };
                    teams.Add(awayTeam);
                    newDb.Teams.Add(awayTeam);
                    newDb.SaveChanges();
                }

                string key = string.Concat(rawMatch.Date.ToString("yyyy-MM-dd"), rawMatch.HomeTeam);
                //keys.Add(key);

                matches.Rows.Add(
                    0,
                    key,
                    rawMatch.Date,
                    homeTeam.Id,
                    awayTeam.Id,
                    season.Id,
                    league.Id,
                    country.Id,
                    (byte)rawMatch.HtGoals,
                    (byte)rawMatch.AtGoals
                );

                //var match = new Match
                //{
                //    CountryId = country.Id,
                //    Date = rawMatch.Date,
                //    Key = string.Concat(rawMatch.Date.ToString("yyyy-MM-dd"), rawMatch.HomeTeam),
                //    HomeTeamId = homeTeam.Id,
                //    AwayTeamId = awayTeam.Id,
                //    SeasonId = season.Id,
                //    LeagueId = league.Id,
                //    HomeGoals = (byte)rawMatch.HtGoals,
                //    AwayGoals = (byte)rawMatch.AtGoals
                //};
                //newDb.Matches.Add(match);
                Console.WriteLine(string.Format("{0} / {1}", counter++, rawMatches.Count));

                
            }
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(newDb.Database.Connection.ConnectionString))
            {
                bulkCopy.DestinationTableName = "Matches";
                bulkCopy.WriteToServer(matches);
            }
        }
    }
}
