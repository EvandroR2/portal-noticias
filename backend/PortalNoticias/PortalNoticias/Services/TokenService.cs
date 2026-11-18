using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PortalNoticias.DTOs.Auth;
using PortalNoticias.Models;

namespace PortalNoticias.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<Usuario> _userManager;

    public TokenService(
        IConfiguration configuration,
        UserManager<Usuario> userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<LoginResponse> GerarAsync(Usuario usuario)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "A chave JWT não foi configurada."
            );

        var issuer = _configuration["Jwt:Issuer"]
            ?? "PortalNoticias.Api";

        var audience = _configuration["Jwt:Audience"]
            ?? "PortalNoticias.Clientes";

        var minutos = int.TryParse(
            _configuration["Jwt:ExpirationMinutes"],
            out var valor
        )
            ? valor
            : 60;

        var perfis = (await _userManager.GetRolesAsync(usuario)).ToArray();

        var claims = new List<Claim>
        {
            new(
                JwtRegisteredClaimNames.Sub,
                usuario.Id.ToString()
            ),
            new(
                JwtRegisteredClaimNames.Email,
                usuario.Email ?? string.Empty
            ),
            new(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            ),
            new(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()
            ),
            new(
                ClaimTypes.Name,
                usuario.Nome
            )
        };

        claims.AddRange(
            perfis.Select(
                perfil => new Claim(ClaimTypes.Role, perfil)
            )
        );

        var expiraEm =
            DateTimeOffset.UtcNow.AddMinutes(minutos);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            ),
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiraEm.UtcDateTime,
            signingCredentials: credentials
        );

        return new LoginResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            "Bearer",
            expiraEm,
            usuario.Nome,
            usuario.Email ?? string.Empty,
            perfis
        );
    }
}