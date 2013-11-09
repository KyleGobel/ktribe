using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ktribe.Web.Startup))]
namespace ktribe.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
