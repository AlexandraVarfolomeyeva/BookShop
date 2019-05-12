using ASPNetCoreApp.Models;
using System.Linq;

namespace ASPNetCoreApp.Data
{
    public static class DbInitializer
    {
        public static void Initialize(BloggingContext context)
        {
            context.Database.EnsureCreated();

            if (context.Blog.Any())
            {
                return;
            }

            var blogs = new Blog[]
            {
                new Blog{Url="http://blogs.msdn.com/dotnet"},
                new Blog{Url="http://blogs.msdn.com/webdev"},
                new Blog{Url="http://blogs.msdn.com/visualstudio"}

            };
            foreach (Blog b in blogs)
            {
                context.Blog.Add(b);
            }
            context.SaveChanges();

            var posts = new Post[]
            {
                new Post { BlogId=1,Content="Today, we are releasing the .NET Core May 2018 Update. This update includes .NET Core 2.1.200 SDK and ASP.NET Core 2.0.8. Security Microsoft is releasing this security advisory to provide information about a vulnerability in .NET Core and .NET native version 2.0.",Title=".NET Core May 2018 Update" },
                new Post { BlogId=1,Content="Today, we are excited to announce that the first release candidate of EF Core 2.1 is available, alongside .NET Core 2.1 RC 1 and ASP.NET Core 2.1 RC 1, for broad testing, and now also for production use! Go live support EF Core 2.1 RC1 is a “go live” release, which means once you test…",Title="Announcing Entity Framework Core 2.1 RC 1" }
            };
            foreach (Post p in posts)
            {
                context.Post.Add(p);
            }
            context.SaveChanges();
        }
    }
}
