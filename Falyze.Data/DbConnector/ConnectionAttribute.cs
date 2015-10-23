using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.DbConnector
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class ConnectionAttribute : Attribute
    {
        public string ConnectionStringName { get; set; }
    }
}
