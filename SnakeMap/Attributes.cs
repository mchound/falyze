using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class DatabaseAttribute : Attribute
    {
        public string ConnectionStringName { get; set; }
        public string ConnectionString { get; set; }
    }

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class TableAttribute : Attribute
    {
        public string TableName { get; set; }
    }

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class PrimaryKeyAttribute : Attribute
    {
        public string PrimaryKey { get; set; }
    }
}
