using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class ConnectionAttribute : Attribute
    {
        public string ConnectionStringName { get; set; }
    }

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class TableAttribute : Attribute
    {
        public string Name { get; set; }
    }

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class PrimaryKeyAttribute : Attribute
    {
        public string Name { get; set; }
    }
}
