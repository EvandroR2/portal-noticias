namespace PortalNoticias.DTOs.Noticias;

public record NoticiaDetalheDto(
    long Id,
    string Slug,
    string Titulo,
    string Resumo,
    string Conteudo,
    string? Categoria,
    string? ImagemUrl,
    string? ImagemAlt,
    string? Autor,
    string? FonteUrl,
    bool Publicada,
    DateTimeOffset PublicadoEm,
    DateTimeOffset CriadoEm,
    DateTimeOffset AtualizadoEm,
    string? SeoTitulo,
    string? SeoDescricao,
    string? ImagemSocialUrl
);
