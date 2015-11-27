using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Mvc;
using System.Web.Http.Controllers;

namespace Falyze.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes(new InheritedDirectRouteProvider());
            //config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }

    public class InheritedDirectRouteProvider : DefaultDirectRouteProvider
    {
        protected override IReadOnlyList<IDirectRouteFactory> GetActionRouteFactories(HttpActionDescriptor actionDescriptor)
        {
            var fromBase = base.GetActionRouteFactories(actionDescriptor);
            System.Collections.ObjectModel.Collection<IDirectRouteFactory> newFactories = actionDescriptor.GetCustomAttributes<IDirectRouteFactory>(inherit: true);
            var combined = new List<IDirectRouteFactory>();
            if(fromBase != null)
            {
                combined.AddRange(fromBase);
            }
            if(newFactories != null)
            {
                combined.AddRange(newFactories);
            }
            return fromBase == null ? combined : fromBase;
        }
    }

    public class RouteFactory : IDirectRouteFactory
    {
        public RouteEntry CreateRoute(DirectRouteFactoryContext context)
        {
            var builder = context.CreateBuilder(string.Empty);
            var action = builder.Actions.First();
            var attr = action.GetCustomAttributes<System.Web.Http.RouteAttribute>(true).FirstOrDefault();
            if(attr != null)
            {
                builder.Template = string.Concat(builder.Template, "/", attr.Template);
            }
            var res = context.CreateBuilder(string.Empty).Build();
            return res;
        }
    }
}
