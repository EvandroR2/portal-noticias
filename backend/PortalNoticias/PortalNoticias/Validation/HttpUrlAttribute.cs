using System.ComponentModel.DataAnnotations;

namespace PortalNoticias.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class HttpUrlAttribute : ValidationAttribute
{
    public HttpUrlAttribute()
    {
        ErrorMessage = "Informe uma URL válida iniciada por http:// ou https://.";
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        var texto = value.ToString();

        if (string.IsNullOrWhiteSpace(texto))
        {
            return true;
        }

        return Uri.TryCreate(texto, UriKind.Absolute, out var uri)
            && (uri.Scheme == Uri.UriSchemeHttp
                || uri.Scheme == Uri.UriSchemeHttps);
    }
}
