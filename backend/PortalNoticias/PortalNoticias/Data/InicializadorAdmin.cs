using Microsoft.AspNetCore.Identity;
using PortalNoticias.Models;

namespace PortalNoticias.Data;

public static class InicializadorAdmin
{
    private const string PerfilAdmin = "Admin";

    public static async Task InicializarAsync(
        IServiceProvider services,
        IConfiguration configuration)
    {
        var email = configuration["BootstrapAdmin:Email"];

        if (string.IsNullOrWhiteSpace(email))
        {
            return;
        }

        var nome = configuration["BootstrapAdmin:Nome"];
        var senha = configuration["BootstrapAdmin:Password"];

        using var scope = services.CreateScope();

        var roleManager =
            scope.ServiceProvider
                .GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        var userManager =
            scope.ServiceProvider
                .GetRequiredService<UserManager<Usuario>>();

        if (!await roleManager.RoleExistsAsync(PerfilAdmin))
        {
            var resultadoPerfil = await roleManager.CreateAsync(
                new IdentityRole<Guid>(PerfilAdmin)
            );

            ValidarResultado(
                resultadoPerfil,
                "Não foi possível criar o perfil Admin."
            );
        }

        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is null)
        {
            if (string.IsNullOrWhiteSpace(senha))
            {
                throw new InvalidOperationException(
                    "A senha inicial do administrador não foi configurada."
                );
            }

            usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = nome ?? "Administrador",
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                Ativo = true,
                LockoutEnabled = true,
                CriadoEm = DateTimeOffset.UtcNow
            };

            if (!usuario.LockoutEnabled)
            {
                usuario.LockoutEnabled = true;

                var resultadoAtualizacao =
                    await userManager.UpdateAsync(usuario);

                ValidarResultado(
                    resultadoAtualizacao,
                    "Não foi possível habilitar o bloqueio do administrador."
                );
            }
            var resultadoUsuario = await userManager.CreateAsync(
                usuario,
                senha
            );

            ValidarResultado(
                resultadoUsuario,
                "Não foi possível criar o administrador."
            );
        }

        if (!await userManager.IsInRoleAsync(usuario, PerfilAdmin))
        {
            var resultadoAssociacao =
                await userManager.AddToRoleAsync(
                    usuario,
                    PerfilAdmin
                );

            ValidarResultado(
                resultadoAssociacao,
                "Não foi possível associar o administrador ao perfil Admin."
            );
        }
    }

    private static void ValidarResultado(
        IdentityResult resultado,
        string mensagem)
    {
        if (resultado.Succeeded)
        {
            return;
        }

        var detalhes = string.Join(
            "; ",
            resultado.Errors.Select(erro => erro.Description)
        );

        throw new InvalidOperationException(
            $"{mensagem} {detalhes}"
        );
    }
}