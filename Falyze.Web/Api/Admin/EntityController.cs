using Falyze.Data.Models;
using SnakeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Falyze.Web.Api.Admin
{
    public abstract class EntityController<T> : BaseAdminController where T : Entity, new()
    {
        [Route("")]
        [HttpGet]
        public virtual HttpResponseMessage Get()
        {
            try
            {
                IEnumerable<T> entities = db.Get<T>();
                return Success<IEnumerable<T>>(entities);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("{id:guid}")]
        [HttpGet]
        public virtual HttpResponseMessage Get(Guid id)
        {
            try
            {
                T entity = db.Get<T>(id);
                return Success<T>(entity);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("")]
        [HttpPost]
        public virtual HttpResponseMessage Post(T entity)
        {
            entity.Id = Guid.NewGuid();
            try
            {
                db.Insert<T>(entity);
                return Success<T>(entity);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("many")]
        [HttpPost]
        public virtual HttpResponseMessage PostMany(IEnumerable<T> entities)
        {
            List<Guid> ids = new List<Guid>();
            foreach (var entity in entities)
            {
                Guid id = Guid.NewGuid();
                ids.Add(id);
                entity.Id = id;
            }
            try
            {
                db.Insert<T>(entities);
                return Success<IEnumerable<Guid>>(ids);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("")]
        [HttpPut]
        public virtual HttpResponseMessage Put(T entity)
        {
            try
            {
                db.Update<T>(entity);
                return Success<T>(entity);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Route("{id:guid}")]
        [HttpDelete]
        public virtual HttpResponseMessage Delete(Guid id)
        {
            try
            {
                db.Delete<T>(id);
                return Success<Guid>(id);
            }
            catch (Exception ex)
            {
                return Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
