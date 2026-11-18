using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PortalNoticias.DTOs.Auth;
using PortalNoticias.Models;
using PortalNoticias.Services;

namespace PortalNoticias.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Usuario> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<Usuario> userManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request)
    {
        var email = request.Email.Trim();

        var usuario =
            await _userManager.FindByEmailAsync(email);

        if (usuario is null || !usuario.Ativo)
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        if (await _userManager.IsLockedOutAsync(usuario))
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        var senhaValida =
            await _userManager.CheckPasswordAsync(
                usuario,
                request.Senha
            );

        if (!senhaValida)
        {
            await _userManager.AccessFailedAsync(usuario);

            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        await _userManager.ResetAccessFailedCountAsync(usuario);

        var resposta =
            await _tokenService.GerarAsync(usuario);

        return Ok(resposta);
    }
}