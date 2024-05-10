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
    public DbSet<VehicleImages> VehicleImages { get; set; }
    public DbSet<VehicleDocuments> VehicleDocuments { get; set; }
    public DbSet<Ride> Rides { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<Feedbacks> Feedbacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure Rider entity
        modelBuilder.Entity<Rider>()
            .HasMany(r => r.Rides)
            .WithOne(ri => ri.Rider)
            .HasForeignKey(ri => ri.RiderID);

        modelBuilder.Entity<Rider>()
            .HasMany(r => r.Feedbacks)
            .WithOne(f => f.Rider)
            .HasForeignKey(f => f.RiderID);

        modelBuilder.Entity<Rider>()
            .HasMany(r => r.PaymentMethods)
            .WithOne()
            .HasForeignKey(pm => pm.PaymentMethodID);

        // Configure Driver entity
        modelBuilder.Entity<Driver>()
            .HasMany(d => d.Rides)
            .WithOne(ri => ri.Driver)
            .HasForeignKey(ri => ri.DriverID);

        modelBuilder.Entity<Driver>()
            .HasMany(d => d.Feedbacks)
            .WithOne(f => f.Driver)
            .HasForeignKey(f => f.DriverID);

        modelBuilder.Entity<Driver>()
            .HasMany(d => d.Vehicles)
            .WithOne(v => v.Driver)
            .HasForeignKey(v => v.DriverID);

        modelBuilder.Entity<Driver>()
            .HasOne(d => d.PaymentMethod)
            .WithMany(pm => pm.Drivers)
            .HasForeignKey(d => d.PaymentMethodID);

        // Configure Administrator entity
        modelBuilder.Entity<Administrator>()
            .HasMany(a => a.Drivers)
            .WithOne()
            .HasForeignKey(d => d.AdministratorID);

        modelBuilder.Entity<Administrator>()
            .HasMany(a => a.Riders)
            .WithOne()
            .HasForeignKey(r => r.AdministratorID);

        // Configure Vehicle entity
        modelBuilder.Entity<Vehicle>()
                    .HasMany(v => v.VehicleImages)
                    .WithOne(vi => vi.Vehicle)
                    .HasForeignKey(vi => vi.VehicleID);

        modelBuilder.Entity<Vehicle>()
            .HasMany(v => v.VehicleDocuments)
            .WithOne(vd => vd.Vehicle)
            .HasForeignKey(vd => vd.VehicleID);

        // Configure Ride entity
        modelBuilder.Entity<Ride>()
            .HasMany(r => r.Feedbacks)
            .WithOne(f => f.Ride)
            .HasForeignKey(f => f.RideID);

        // Configure PaymentMethod entity
        modelBuilder.Entity<PaymentMethod>()
            .HasMany(pm => pm.Riders)
            .WithOne()
            .HasForeignKey(r => r.PaymentMethodID);

        modelBuilder.Entity<PaymentMethod>()
            .HasMany(pm => pm.Drivers)
            .WithOne()
            .HasForeignKey(d => d.PaymentMethodID);

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

        // Configure composite keys if needed
        modelBuilder.Entity<VehicleImages>()
            .HasKey(vi => new { vi.VehicleImagesID, vi.VehicleID });

        modelBuilder.Entity<VehicleDocuments>()
            .HasKey(vd => new { vd.VehicleDocumentsID, vd.VehicleID });
    }

}
