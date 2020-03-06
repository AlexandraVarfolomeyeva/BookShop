using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace WebAPI.Models
{
    public partial class BookingContext : IdentityDbContext<User>
    {

        #region Constructor
        public BookingContext(DbContextOptions<BookingContext>
        options)
        : base(options)
        { }
        #endregion
        public virtual DbSet<Order> Order { get; set; }
        public virtual DbSet<Book> Book { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<BookOrder> BookOrder { get; set; }

        protected override void OnModelCreating(ModelBuilder
        modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(a => a.User).WithMany(b => b.Orders).HasForeignKey(d => d.UserId);
                entity.HasMany(a => a.BookOrders).WithOne(a => a.Order).HasForeignKey(a => a.IdOrder);
               
            });

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasMany(a => a.BookOrders).WithOne(a => a.Book).HasForeignKey(a => a.IdBook);
            });


            
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasMany(a => a.Orders).WithOne(b => b.User).HasForeignKey(c => c.UserId);
            });
            modelBuilder.Entity<BookOrder>(entity =>
            {
                entity.HasOne(a => a.Order).WithMany(a => a.BookOrders).HasForeignKey(a => a.IdOrder);
                entity.HasOne(a => a.Book).WithMany(a => a.BookOrders).HasForeignKey(a => a.IdBook);
            });
        }
    }


}
