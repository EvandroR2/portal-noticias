using System.ComponentModel.DataAnnotations;

namespace PortalNoticias.DTOs.Noticias;

public class AtualizarNoticiaDto
{
    [Required]
    public string Titulo { get; set; } = string.Empty;

    [Required]
    public string Resumo { get; set; } = string.Empty;

    [Required]
    public string Conteudo { get; set; } = string.Empty;

    public string? Categoria { get; set; }

    [PortalNoticias.Validation.HttpUrl]
    [StringLength(2048)]
    public string? ImagemUrl { get; set; }

    public string? ImagemAlt { get; set; }

    public string? Autor { get; set; }

    [PortalNoticias.Validation.HttpUrl]
    [StringLength(2048)]
    public string? FonteUrl { get; set; }

    public bool Publicada { get; set; }

    public string? SeoTitulo { get; set; }

    public string? SeoDescricao { get; set; }

    [PortalNoticias.Validation.HttpUrl]
    [StringLength(2048)]
    public string? ImagemSocialUrl { get; set; }
}
