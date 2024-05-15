using Microsoft.EntityFrameworkCore;
using RrezeBack.Data.Model;

public class DBContext : DbContext
{
    public DBContext(DbContextOptions<DBContext> options)
        : base(options)
    {
    }

    public DbSet<Rider> Riders { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Administrator> Administrators { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<PaymentMethod> PaymentMethod{ get; set; }

    public DbSet<Ride> Rides { get; set; }
    public DbSet<Feedbacks> Feedbacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       

        modelBuilder.Entity<Rider>()
            .HasMany(r => r.Feedbacks)
            .WithOne(f => f.Rider)
            .HasForeignKey(f => f.RiderID);


        // Configure Driver entity
        

        modelBuilder.Entity<Driver>()
            .HasMany(d => d.Feedbacks)
            .WithOne(f => f.Driver)
            .HasForeignKey(f => f.DriverID);

        modelBuilder.Entity<Driver>()
            .HasMany(d => d.Vehicles)
            .WithOne(v => v.Driver)
            .HasForeignKey(v => v.DriverID);



        // Configure Ride entity
        modelBuilder.Entity<Ride>()
            .HasMany(r => r.Feedbacks)
            .WithOne(f => f.Ride)
            .HasForeignKey(f => f.RideID);

        

        // Configure Feedback entity
        modelBuilder.Entity<Feedbacks>()
            .HasOne(f => f.Rider)
            .WithMany(r => r.Feedbacks)
            .HasForeignKey(f => f.RiderID);

        modelBuilder.Entity<Feedbacks>()
            .HasOne(f => f.Driver)
            .WithMany(d => d.Feedbacks)
            .HasForeignKey(f => f.DriverID);

        modelBuilder.Entity<Feedbacks>()
            .HasOne(f => f.Ride)
            .WithMany(r => r.Feedbacks)
            .HasForeignKey(f => f.RideID);

    }

}
