using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;

namespace Falyze.Web.Helpers.ModelBinders
{
    public class EnumerableModelBinder : IModelBinder
    {
        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            string value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).AttemptedValue;
            bindingContext.Model = value.Split(';').AsEnumerable();
            return true;
        }
    }
}