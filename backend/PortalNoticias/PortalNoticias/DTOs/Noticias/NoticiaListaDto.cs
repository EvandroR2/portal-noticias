namespace PortalNoticias.DTOs.Noticias;

public record NoticiaListaDto(
    long Id,
    string Slug,
    string Titulo,
    string Resumo,
    string? Categoria,
    string? ImagemUrl,
    string? ImagemAlt,
    string? Autor,
    DateTimeOffset PublicadoEm
);