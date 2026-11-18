using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PortalNoticias.Models;

namespace PortalNoticias.Data;

public class AuthDbContext
    : IdentityDbContext<Usuario, IdentityRole<Guid>, Guid>
{
    public AuthDbContext(
        DbContextOptions<AuthDbContext> options)
        : base(options)
    {
    }
}