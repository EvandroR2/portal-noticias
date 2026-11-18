using PortalNoticias.DTOs.Auth;
using PortalNoticias.Models;

namespace PortalNoticias.Services;

public interface ITokenService
{
    Task<LoginResponse> GerarAsync(Usuario usuario);
}