﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnakeMap
{
    public interface IEntity
    {
        void Map(SqlDataReader rdr);
    }

    public abstract class Entity : IEntity
    {
        public virtual void Map(SqlDataReader rdr)
        {
            var properties = this.GetType().GetProperties();
            foreach (var property in properties)
            {
                int index = rdr.GetOrdinal(property.Name);
                if (rdr.IsDBNull(index))
                {
                    property.SetValue(this, null);
                    continue;
                }
                property.SetValue(this, rdr.GetValue(index));
            }
        }
    }

    public interface IWritabelEntity : IEntity
    {
        string InsertCommandFromEntity();
        string UpdateCommandFromEntity(string primaryKeyField);
        Dictionary<string, string> GetEntityValues();
        string GetPrimaryKey(string primaryKeyField);
    }

    public abstract class WritableEntity : Entity
    {
        public string InsertCommandFromEntity()
        {
            Dictionary<string, string> fieldValues = this.GetEntityValues();

            string fields = string.Join(",", fieldValues.Select(f => f.Key));
            string values = string.Join(",", fieldValues.Select(f => f.Value));
            return string.Format("({0}) VALUES ({1})", fields, values);
        }

        public string UpdateCommandFromEntity(string primaryKeyField)
        {
            Dictionary<string, string> fieldValues = this.GetEntityValues().Where(f => f.Key != primaryKeyField).ToDictionary(f => f.Key, f => f.Value);
            string fields = string.Join(",", fieldValues.Select(f => string.Format("{0}={1}", f.Key, f.Value)));
            string primaryKeyValue = this.GetPrimaryKey(primaryKeyField);
            return string.Format("{0} WHERE {1} = '{2}'", fields, primaryKeyField, primaryKeyValue);
        }

        public virtual Dictionary<string, string> GetEntityValues()
        {
            Dictionary<string, string> fieldValues = new Dictionary<string, string>();
            var properties = this.GetType().GetProperties();
            foreach (var property in properties)
            {
                object propertyValue = property.GetValue(this);
                if (propertyValue != null)
                {
                    fieldValues.Add(property.Name, string.Format("'{0}'", propertyValue.ToString()));
                }
                else
                {
                    fieldValues.Add(property.Name, "null");
                }
            }
            return fieldValues;
        }

        public virtual string GetPrimaryKey(string primaryKeyField)
        {
            return this.GetType().GetProperties().First(p => p.Name == primaryKeyField).GetValue(this).ToString();
        }
    }

    public abstract class BulkWritableEntity : WritableEntity
    {
        public abstract object[] GetColumnValues();
        public abstract IEnumerable<DataColumn> GetColumns();
    }
}
