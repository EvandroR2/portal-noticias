using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortalNoticias.Models;

[Table("noticias")]
public class Noticia
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("slug")]
    public string Slug { get; set; } = string.Empty;

    [Column("titulo")]
    public string Titulo { get; set; } = string.Empty;

    [Column("resumo")]
    public string Resumo { get; set; } = string.Empty;

    [Column("conteudo")]
    public string Conteudo { get; set; } = string.Empty;

    [Column("categoria")]
    public string? Categoria { get; set; }

    [Column("imagem_url")]
    public string? ImagemUrl { get; set; }

    [Column("imagem_alt")]
    public string? ImagemAlt { get; set; }

    [Column("autor")]
    public string? Autor { get; set; }
    [Column("fonte_url")]
    public string? FonteUrl { get; set; }

    [Column("criado_por")]
    public Guid? CriadoPor { get; set; }

    [Column("publicada")]
    public bool Publicada { get; set; }

    [Column("publicado_em")]
    public DateTimeOffset PublicadoEm { get; set; }

    [Column("criado_em")]
    public DateTimeOffset CriadoEm { get; set; }

    [Column("atualizado_em")]
    public DateTimeOffset AtualizadoEm { get; set; }

    [Column("seo_titulo")]
    public string? SeoTitulo { get; set; }

    [Column("seo_descricao")]
    public string? SeoDescricao { get; set; }

    [Column("imagem_social_url")]
    public string? ImagemSocialUrl { get; set; }

}