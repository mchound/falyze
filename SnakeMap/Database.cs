using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    public class Database
    {
        private SqlConnection _connection;

        public Database()
        {
            Attribute attr = Attribute.GetCustomAttribute(this.GetType(), typeof(DatabaseAttribute));
            if (attr == null)
            {
                throw new Exception("Connection string name must be available through constructor or DatabaseAttribute");
            }

            DatabaseAttribute connectionAttribute = attr as DatabaseAttribute;
            this.InitializeConnection(ConfigurationManager.ConnectionStrings[connectionAttribute.ConnectionStringName].ConnectionString);
        }
        public Database(string connectionStringName, string connectionString)
        {
            string _connectionString = connectionString ?? ConfigurationManager.ConnectionStrings[connectionStringName].ConnectionString;
            this.InitializeConnection(_connectionString);
        }

        public IEnumerable<T> Get<T>() where T : Entity, new()
        {
            return this.Get<T>(this.GetTableName<T>());
        }

        public IEnumerable<T> Get<T>(string tableName) where T : Entity, new()
        {
            return this.Map<T>(string.Format("SELECT * FROM {0}", tableName));
        }

        public T Get<T>(object primaryKeyValue) where T : Entity, new()
        {
            return this.Get<T>(primaryKeyValue, this.GetPrimaryKey<T>());
        }

        public T Get<T>(object primaryKeyValue, string primaryKeyName) where T : Entity, new()
        {
            return this.Get<T>(primaryKeyValue, this.GetPrimaryKey<T>(), this.GetTableName<T>());
        }

        public T Get<T>(object primaryKeyValue, string primaryKeyName, string tableName) where T : Entity, new()
        {
            return this.Map<T>(string.Format("SELECT * FROM {0} WHERE {1} = '{2}'", tableName, primaryKeyName, primaryKeyValue)).FirstOrDefault();
        }

        public IEnumerable<T> In<T>(string column, IEnumerable<string> values) where T : Entity, new()
        {
            return this.In<T>(column, values, this.GetTableName<T>());
        }

        public IEnumerable<T> In<T>(string column, IEnumerable<string> values, string tableName) where T : Entity, new()
        {
            return this.Map<T>(string.Format("SELECT * FROM {0} WHERE {1} IN ({2})", tableName, column, string.Join(",", values.Select(i => string.Concat("'", i, "'")))));
        }

        public IEnumerable<T> Where<T>(string whereClause) where T : Entity, new()
        {
            return this.Where<T>(whereClause, this.GetTableName<T>());
        }

        public IEnumerable<T> Where<T>(string whereClause, string tableName) where T : Entity, new()
        {
            return this.Map<T>(string.Format("SELECT * FROM {0} WHERE {1}", tableName, whereClause));
        }

        public IEnumerable<T> Map<T>(string sqlCommand) where T : Entity, new()
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            SqlCommand cmd = new SqlCommand(sqlCommand, _connection);
            var rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            IEnumerable<T> entitites = EntityMapper.Map<T>(rdr).ToList();
            rdr.Close();
            return entitites;
        }
        
        public int Count(string sqlCommand)
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            SqlCommand cmd = new SqlCommand(sqlCommand, _connection);
            var count = (int)cmd.ExecuteScalar();
            _connection.Close();
            return count;
        }

        public T Insert<T>(T entity) where T : WritableEntity
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            string insertCaluse = entity.InsertCommandFromEntity();
            SqlCommand cmd = new SqlCommand(string.Format("INSERT INTO {0} {1}", tableName, insertCaluse), _connection);
            cmd.ExecuteNonQuery();
            _connection.Close();
            return entity;
        }

        public IEnumerable<T> Insert<T>(IEnumerable<T> entities) where T : BulkWritableEntity
        {
            if(entities == null || entities.Count() == 0)
            {
                return entities;
            }

            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            DataTable dataTable = new DataTable(tableName);
            var columns = this.GetColumnsForType<T>(entities.First());
            if (columns != null)
            {
                dataTable.Columns.AddRange(columns.ToArray());
            }
            foreach (var entity in entities)
            {
                dataTable.Rows.Add(entity.GetColumnValues());
            }
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(_connection))
            {
                bulkCopy.DestinationTableName = tableName;
                bulkCopy.WriteToServer(dataTable);
            }
            _connection.Close();
            return entities;

        }

        public void Update<T>(string sqlCommand)
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            string tableName = this.GetTableName<T>();
            SqlCommand cmd = new SqlCommand(string.Format("UPDATE {0} SET {1}", tableName, sqlCommand), _connection);
            _connection.Close();
            cmd.ExecuteNonQuery();
        }

        public T Update<T>(T entity) where T : WritableEntity
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
            _connection.Close();
            return entity;
        }

        public IEnumerable<T> Update<T>(IEnumerable<T> entitites) where T : WritableEntity
        {
            foreach (var entity in entitites)
            {
                yield return this.Update<T>(entity);
            }
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
            _connection.Close();
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

            return (attr as TableAttribute).TableName;
        }

        private string GetPrimaryKey<T>()
        {
            Attribute attr = Attribute.GetCustomAttribute(typeof(T), typeof(PrimaryKeyAttribute));
            if (attr == null)
            {
                throw new Exception("Class must include PrimaryKey attribute to run updates");
            }

            return (attr as PrimaryKeyAttribute).PrimaryKey;
        }

        private IEnumerable<DataColumn> GetColumnsForType<T>(T entity)
        {
            var method = typeof(T).GetMethod("GetColumns");
            return method == null ? null : method.Invoke(entity, null) as IEnumerable<DataColumn>;
        }
    }
}