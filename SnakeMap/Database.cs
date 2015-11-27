using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
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
            return this.GetWhere<T>(string.Format("{0} = '{1}'", keyColumn, keyValue.ToString())).FirstOrDefault();
        }

        public IEnumerable<T> Get<T>() where T : Table, new()
        {
            return this.GetWhere<T>(string.Empty);
        }

        public IEnumerable<T> Get<T>(string columnName, IEnumerable<string> inCollection) where T : Table, new()
        {
            if(inCollection == null || inCollection.Count() == 0)
            {
                return Enumerable.Empty<T>();
            }
            return this.GetWhere<T>(string.Format("{0} IN ({1})", columnName, string.Join(",", inCollection.Select(i => string.Concat("'", i, "'")))));
        }

        public IEnumerable<T> Get<T>(string columnName, IEnumerable<string> inCollection, string andCommand) where T : Table, new()
        {
            if (inCollection == null || inCollection.Count() == 0)
            {
                return Enumerable.Empty<T>();
            }
            string cmd = string.Format("{0} IN ({1})", columnName, string.Join(",", inCollection.Select(i => string.Concat("'", i, "'"))));
            return this.GetWhere<T>(string.Format("{0} AND {1}", cmd, andCommand));
        }

        public IEnumerable<T> Get<T>(string sql) where T : Table, new()
        {
            string tableName = this.GetTableName<T>();
            return this.Get<T>(sql, tableName);
        }

        public IEnumerable<T> Get<T>(string sql, string tableName) where T : Table, new()
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }

            SqlCommand cmd = new SqlCommand(sql, _connection);
            SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.Default);
            IEnumerable<T> entities = EntityMapper.MapToEntities<T>(rdr).ToList();
            rdr.Close();
            return entities;
        }

        public IEnumerable<T> GetWhere<T>(string whereExpression) where T : Table, new()
        {
            bool hasCustomCommand = !string.IsNullOrWhiteSpace(whereExpression);
            string tableName = this.GetTableName<T>();
            string sql = string.Format("SELECT * FROM {0} {1} {2}", tableName, hasCustomCommand ? "WHERE" : string.Empty, whereExpression);
            return this.Get<T>(sql, tableName);
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

        public IEnumerable<T> Insert<T>(IEnumerable<T> entities) where T : Table
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }
            
            string tableName = this.GetTableName<T>();
            DataTable dataTable = new DataTable(tableName);
            var columns = this.GetColumnsForType<T>();
            if(columns != null)
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
            
            return entities;

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

        private IEnumerable<DataColumn> GetColumnsForType<T>()
        {
            var method = typeof(T).GetMethod("GetDataColumns");
            return method == null ? null : method.Invoke(null, null) as IEnumerable<DataColumn>;
        }
    }
}
