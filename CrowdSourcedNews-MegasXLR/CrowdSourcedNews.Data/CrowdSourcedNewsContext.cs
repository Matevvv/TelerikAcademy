namespace CrowdSourcedNews.Data
{
    using System.Data.Entity;
    using CrowdSourcedNews.Models;

    public class CrowdSourcedNewsContext : DbContext
    {
        public CrowdSourcedNewsContext()
            : base("CrowdSourcedNewsDb")
        { }

        public DbSet<User> Users { get; set; }

        public DbSet<NewsArticle> NewsArticles { get; set; }

        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Comment>()
                 .HasOptional(c => c.ParentComment)
                 .WithMany(c => c.SubComments)
                 .HasForeignKey(c => c.ParentID);
        }
    }
}
