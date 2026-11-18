namespace PortalNoticias.DTOs.Noticias;

public record NoticiaAdminListaDto(
    long Id,
    string Slug,
    string Titulo,
    string? Categoria,
    string? Autor,
    bool Publicada,
    DateTimeOffset PublicadoEm,
    DateTimeOffset CriadoEm,
    DateTimeOffset AtualizadoEm
);
