using Microsoft.AspNetCore.Identity;

namespace PortalNoticias.Models;

public class Usuario : IdentityUser<Guid>
{
    public string Nome { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    public DateTimeOffset CriadoEm { get; set; } =
        DateTimeOffset.UtcNow;
}