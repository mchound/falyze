using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Falyze.Data.DbConnector
{
    public abstract class Database : IDisposable
    {
        private SqlConnection _connection;

        public Database()
        {
            Attribute attr = Attribute.GetCustomAttribute(this.GetType(), typeof(ConnectionAttribute));
            if(attr == null)
            {
                throw new Exception("Connection string name must be passed as a parameter to constructor or specified through Connection Attribute");
            }

            ConnectionAttribute connectionAttribute = attr as ConnectionAttribute;
            this.InitializeConnection(ConfigurationManager.ConnectionStrings[connectionAttribute.ConnectionStringName].ConnectionString);
        }
        public Database(string connectionStringName)
        {
            this.InitializeConnection(ConfigurationManager.ConnectionStrings[connectionStringName].ConnectionString);
        }

        public IEnumerable<T> Get<T>() where T : DbTable, new()
        {
            return this.Get<T>(string.Empty);
        }

        public IEnumerable<T> Get<T>(string sqlCommand) where T : DbTable, new()
        {
            if(_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            bool hasCustomCommand = !string.IsNullOrWhiteSpace(sqlCommand);

            SqlCommand cmd = new SqlCommand(string.Format("SELECT * FROM {0} {1} {2}", tableName, hasCustomCommand ? "WHERE": string.Empty, sqlCommand), _connection);
            SqlDataReader rdr = cmd.ExecuteReader(System.Data.CommandBehavior.Default);
            return EntityMapper.MapToEntities<T>(rdr).ToList();
        }

        public void Dispose()
        {
            _connection.Dispose();
        }

        private void InitializeConnection(string connectionString)
        {
            _connection = new SqlConnection(connectionString);
        }

        private string GetTableName<T>()
        {
            Attribute attr = Attribute.GetCustomAttribute(typeof(T), typeof(TableAttribute));
            if(attr == null)
            {
                throw new Exception("Class must include table attribute");
            }

            return (attr as TableAttribute).TableName;
        }
    }
    
    [Connection(ConnectionStringName = "BetterDatabase")]    
    public class BetterDatabase : Database
    {

    }
}
