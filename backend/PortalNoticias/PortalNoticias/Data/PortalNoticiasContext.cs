using Microsoft.EntityFrameworkCore;
using PortalNoticias.Models;

namespace PortalNoticias.Data;

public class PortalNoticiasContext : DbContext
{
    public PortalNoticiasContext(
        DbContextOptions<PortalNoticiasContext> options)
        : base(options)
    {
    }

    public DbSet<Noticia> Noticias => Set<Noticia>();
}