using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.Models
{
    [PrimaryKey(Name = "Id")]
    public abstract class Entity : Table
    {
        public Guid Id { get; set; }
    }
}
