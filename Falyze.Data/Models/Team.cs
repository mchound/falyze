using Falyze.Data.DbConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.Models
{
    [Table(TableName = "Teams")]
    public class Team : DbTable
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string Name { get; set; }
    }
}
