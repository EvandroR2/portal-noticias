using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalNoticias.Data;
using PortalNoticias.DTOs.Noticias;
using PortalNoticias.Models;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace PortalNoticias.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NoticiasController : ControllerBase
{
    private readonly PortalNoticiasContext _context;

    public NoticiasController(PortalNoticiasContext context)
    {
        _context = context;
    }

    private static string GerarSlug(string titulo)
    {
        var textoNormalizado =
            titulo.Normalize(NormalizationForm.FormD);

        var semAcentos = new StringBuilder();

        foreach (var caractere in textoNormalizado)
        {
            var categoria =
                CharUnicodeInfo.GetUnicodeCategory(caractere);

            if (categoria != UnicodeCategory.NonSpacingMark)
            {
                semAcentos.Append(caractere);
            }
        }

        var slug = semAcentos
            .ToString()
            .Normalize(NormalizationForm.FormC)
            .ToLowerInvariant();

        slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");
        slug = slug.Trim('-');

        return string.IsNullOrWhiteSpace(slug)
            ? $"noticia-{Guid.NewGuid():N}"
            : slug;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoticiaListaDto>>> Listar(
        CancellationToken cancellationToken)
    {
        var noticias = await _context.Noticias
            .AsNoTracking()
            .Where(noticia => noticia.Publicada)
            .OrderByDescending(noticia => noticia.PublicadoEm)
            .Select(noticia => new NoticiaListaDto(
                noticia.Id,
                noticia.Slug,
                noticia.Titulo,
                noticia.Resumo,
                noticia.Categoria,
                noticia.ImagemUrl,
                noticia.ImagemAlt,
                noticia.Autor,
                noticia.PublicadoEm
            ))
            .ToListAsync(cancellationToken);

        return Ok(noticias);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<NoticiaAdminListaDto>>> ListarAdmin(
        CancellationToken cancellationToken)
    {
        var noticias = await _context.Noticias
            .AsNoTracking()
            .OrderByDescending(noticia => noticia.AtualizadoEm)
            .Select(noticia => new NoticiaAdminListaDto(
                noticia.Id,
                noticia.Slug,
                noticia.Titulo,
                noticia.Categoria,
                noticia.Autor,
                noticia.Publicada,
                noticia.PublicadoEm,
                noticia.CriadoEm,
                noticia.AtualizadoEm
            ))
            .ToListAsync(cancellationToken);

        return Ok(noticias);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/{id:long}")]
    public async Task<ActionResult<NoticiaDetalheDto>> ObterAdminPorId(
        long id,
        CancellationToken cancellationToken)
    {
        var noticia = await _context.Noticias
            .AsNoTracking()
            .SingleOrDefaultAsync(noticia => noticia.Id == id, cancellationToken);

        if (noticia is null)
        {
            return NotFound(new { mensagem = "Notícia não encontrada." });
        }

        return Ok(CriarDetalhe(noticia));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<NoticiaDetalheDto>> ObterPorSlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var noticia = await _context.Noticias
            .AsNoTracking()
            .Where(noticia => noticia.Slug == slug && noticia.Publicada)
            .Select(noticia => new NoticiaDetalheDto(
                noticia.Id,
                noticia.Slug,
                noticia.Titulo,
                noticia.Resumo,
                noticia.Conteudo,
                noticia.Categoria,
                noticia.ImagemUrl,
                noticia.ImagemAlt,
                noticia.Autor,
                noticia.FonteUrl,
                noticia.Publicada,
                noticia.PublicadoEm,
                noticia.CriadoEm,
                noticia.AtualizadoEm,
                noticia.SeoTitulo,
                noticia.SeoDescricao,
                noticia.ImagemSocialUrl
            ))
            .SingleOrDefaultAsync(cancellationToken);

        if (noticia is null)
        {
            return NotFound(new { mensagem = "Notícia não encontrada." });
        }

        return Ok(noticia);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<NoticiaDetalheDto>> Criar(
    CriarNoticiaDto request,
    CancellationToken cancellationToken)
    {
        var usuarioId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(usuarioId, out var criadoPor))
        {
            return Unauthorized(new { mensagem = "Token inválido." });
        }

        var slugBase = GerarSlug(request.Titulo);
        var slug = slugBase;
        var contador = 2;

        while (await _context.Noticias.AnyAsync(
            noticia => noticia.Slug == slug,
            cancellationToken))
        {
            slug = $"{slugBase}-{contador}";
            contador++;
        }

        var agora = DateTimeOffset.UtcNow;

        var noticia = new Noticia
        {
            Slug = slug,
            Titulo = request.Titulo.Trim(),
            Resumo = request.Resumo.Trim(),
            Conteudo = request.Conteudo.Trim(),
            Categoria = request.Categoria?.Trim(),
            ImagemUrl = request.ImagemUrl?.Trim(),
            ImagemAlt = request.ImagemAlt?.Trim(),
            Autor = request.Autor?.Trim(),
            FonteUrl = request.FonteUrl?.Trim(),
            CriadoPor = criadoPor,
            Publicada = request.Publicada,
            PublicadoEm = agora,
            CriadoEm = agora,
            AtualizadoEm = agora,
            SeoTitulo = request.SeoTitulo?.Trim(),
            SeoDescricao = request.SeoDescricao?.Trim(),
            ImagemSocialUrl = request.ImagemSocialUrl?.Trim()
        };

        _context.Noticias.Add(noticia);

        await _context.SaveChangesAsync(cancellationToken);

        var resposta = new NoticiaDetalheDto(
            noticia.Id,
            noticia.Slug,
            noticia.Titulo,
            noticia.Resumo,
            noticia.Conteudo,
            noticia.Categoria,
            noticia.ImagemUrl,
            noticia.ImagemAlt,
            noticia.Autor,
            noticia.FonteUrl,
            noticia.Publicada,
            noticia.PublicadoEm,
            noticia.CriadoEm,
            noticia.AtualizadoEm,
            noticia.SeoTitulo,
            noticia.SeoDescricao,
            noticia.ImagemSocialUrl
        );

        return CreatedAtAction(
            nameof(ObterPorSlug),
            new { slug = noticia.Slug },
            resposta
        );
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:long}")]
    public async Task<ActionResult<NoticiaDetalheDto>> Atualizar(
        long id,
        AtualizarNoticiaDto request,
        CancellationToken cancellationToken)
    {
        var noticia = await _context.Noticias
            .SingleOrDefaultAsync(noticia => noticia.Id == id, cancellationToken);

        if (noticia is null)
        {
            return NotFound(new { mensagem = "Notícia não encontrada." });
        }

        var slugBase = GerarSlug(request.Titulo);
        var slug = slugBase;
        var contador = 2;

        while (await _context.Noticias.AnyAsync(
            outra => outra.Id != id && outra.Slug == slug,
            cancellationToken))
        {
            slug = $"{slugBase}-{contador}";
            contador++;
        }

        noticia.Slug = slug;
        noticia.Titulo = request.Titulo.Trim();
        noticia.Resumo = request.Resumo.Trim();
        noticia.Conteudo = request.Conteudo.Trim();
        noticia.Categoria = request.Categoria?.Trim();
        noticia.ImagemUrl = request.ImagemUrl?.Trim();
        noticia.ImagemAlt = request.ImagemAlt?.Trim();
        noticia.Autor = request.Autor?.Trim();
        noticia.FonteUrl = request.FonteUrl?.Trim();
        noticia.Publicada = request.Publicada;
        noticia.AtualizadoEm = DateTimeOffset.UtcNow;
        noticia.SeoTitulo = request.SeoTitulo?.Trim();
        noticia.SeoDescricao = request.SeoDescricao?.Trim();
        noticia.ImagemSocialUrl = request.ImagemSocialUrl?.Trim();

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(CriarDetalhe(noticia));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Excluir(
        long id,
        CancellationToken cancellationToken)
    {
        var noticia = await _context.Noticias
            .SingleOrDefaultAsync(noticia => noticia.Id == id, cancellationToken);

        if (noticia is null)
        {
            return NotFound(new { mensagem = "Notícia não encontrada." });
        }

        _context.Noticias.Remove(noticia);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static NoticiaDetalheDto CriarDetalhe(Noticia noticia)
    {
        return new NoticiaDetalheDto(
            noticia.Id,
            noticia.Slug,
            noticia.Titulo,
            noticia.Resumo,
            noticia.Conteudo,
            noticia.Categoria,
            noticia.ImagemUrl,
            noticia.ImagemAlt,
            noticia.Autor,
            noticia.FonteUrl,
            noticia.Publicada,
            noticia.PublicadoEm,
            noticia.CriadoEm,
            noticia.AtualizadoEm,
            noticia.SeoTitulo,
            noticia.SeoDescricao,
            noticia.ImagemSocialUrl
        );
    }
}
