using Falyze.Data.DbConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.Models
{
    [Table(TableName = "Leagues")]
    public class League : DbTable
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
        public int CountryId { get; set; }
    }
}
