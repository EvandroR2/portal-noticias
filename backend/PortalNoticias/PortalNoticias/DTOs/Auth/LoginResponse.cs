namespace PortalNoticias.DTOs.Auth;

public record LoginResponse(
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiraEm,
    string Nome,
    string Email,
    IReadOnlyCollection<string> Perfis
);