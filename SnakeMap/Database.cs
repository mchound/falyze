using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    public abstract class Database : IDisposable
    {
        private SqlConnection _connection;

        public Database()
        {
            Attribute attr = Attribute.GetCustomAttribute(this.GetType(), typeof(ConnectionAttribute));
            if (attr == null)
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

        public T Get<T>(object keyValue) where T : Table, new()
        {
            return this.Get<T>(keyValue, "id");
        }

        public T Get<T>(object keyValue, string keyColumn) where T : Table, new()
        {
            return this.Get<T>(string.Format("{0} = '{1}'", keyColumn, keyValue.ToString())).FirstOrDefault();
        }

        public IEnumerable<T> Get<T>() where T : Table, new()
        {
            return this.Get<T>(string.Empty);
        }

        public IEnumerable<T> Get<T>(string columnName, IEnumerable<string> inCollection) where T : Table, new()
        {
            if(inCollection == null || inCollection.Count() == 0)
            {
                return Enumerable.Empty<T>();
            }
            return this.Get<T>(string.Format("{0} IN ({1})", columnName, string.Join(",", inCollection.Select(i => string.Concat("'", i, "'")))));
        }

        public IEnumerable<T> Get<T>(string columnName, IEnumerable<string> inCollection, string andCommand) where T : Table, new()
        {
            if (inCollection == null || inCollection.Count() == 0)
            {
                return Enumerable.Empty<T>();
            }
            string cmd = string.Format("{0} IN ({1})", columnName, string.Join(",", inCollection.Select(i => string.Concat("'", i, "'"))));
            return this.Get<T>(string.Format("{0} AND {1}", cmd, andCommand));
        }

        public IEnumerable<T> Get<T>(string sqlCommand) where T : Table, new()
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            bool hasCustomCommand = !string.IsNullOrWhiteSpace(sqlCommand);

            SqlCommand cmd = new SqlCommand(string.Format("SELECT * FROM {0} {1} {2}", tableName, hasCustomCommand ? "WHERE" : string.Empty, sqlCommand), _connection);
            SqlDataReader rdr = cmd.ExecuteReader(System.Data.CommandBehavior.Default);
            IEnumerable<T> entities = EntityMapper.MapToEntities<T>(rdr).ToList();
            rdr.Close();
            return entities;
        }

        public T Insert<T>(T entity) where T : Table
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            string insertCaluse = entity.InsertCommandFromEntity();
            SqlCommand cmd = new SqlCommand(string.Format("INSERT INTO {0} {1}", tableName, insertCaluse), _connection);
            cmd.ExecuteNonQuery();
            return entity;
        }

        public T Update<T>(T entity) where T : Table
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            string primaryKeyField = this.GetPrimaryKey<T>();
            string updateCmd = entity.UpdateCommandFromEntity(primaryKeyField);
            SqlCommand cmd = new SqlCommand(string.Format("UPDATE {0} SET {1}", tableName, updateCmd), _connection);
            cmd.ExecuteNonQuery();
            return entity;
        }

        public void Delete<T>(object primaryKeyValue)
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            string primaryKeyField = this.GetPrimaryKey<T>();
            SqlCommand cmd = new SqlCommand(string.Format("DELETE FROM {0} WHERE {1} = '{2}'", tableName, primaryKeyField, primaryKeyValue), _connection);
            cmd.ExecuteNonQuery();
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
            if (attr == null)
            {
                throw new Exception("Class must include table attribute");
            }

            return (attr as TableAttribute).Name;
        }

        private string GetPrimaryKey<T>()
        {
            Attribute attr = Attribute.GetCustomAttribute(typeof(T), typeof(PrimaryKeyAttribute));
            if (attr == null)
            {
                throw new Exception("Class must include PrimaryKey attribute to run updates");
            }

            return (attr as PrimaryKeyAttribute).Name;
        }
    }
}
