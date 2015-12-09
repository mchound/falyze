using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.Models
{
    [PrimaryKey(PrimaryKey = "Id")]
    public abstract class DatabaseModel : Entity
    {
        public Guid Id { get; set; }
    }

    [PrimaryKey(PrimaryKey = "Id")]
    public abstract class Writable : WritableEntity
    {
        public Guid Id { get; set; }
    }

    [PrimaryKey(PrimaryKey = "Id")]
    public abstract class BulkWritable : BulkWritableEntity
    {
        public Guid Id { get; set; }
    }
}
