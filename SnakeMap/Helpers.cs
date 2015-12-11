using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    public static class Helpers
    {
        public static string ToInCollection<T>(this IEnumerable<T> objects)
        {
            return string.Format("({0})", string.Join(",", objects.Select(o => string.Format("'{0}'", o.ToString()))));
        }
    }
}
