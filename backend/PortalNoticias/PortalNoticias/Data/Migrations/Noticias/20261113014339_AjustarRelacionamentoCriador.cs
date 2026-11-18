using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortalNoticias.Data.Migrations.Noticias
{
    /// <inheritdoc />
    public partial class AjustarRelacionamentoCriador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE noticias
                DROP CONSTRAINT IF EXISTS noticias_criado_por_fkey;
                """);

            migrationBuilder.Sql("""
                UPDATE noticias AS n
                SET criado_por = NULL
                WHERE criado_por IS NOT NULL
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "AspNetUsers" AS u
                      WHERE u."Id" = n.criado_por
                  );
                """);

            migrationBuilder.Sql("""
                ALTER TABLE noticias
                ADD CONSTRAINT noticias_criado_por_fkey
                FOREIGN KEY (criado_por)
                REFERENCES "AspNetUsers" ("Id")
                ON DELETE SET NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE noticias
                DROP CONSTRAINT IF EXISTS noticias_criado_por_fkey;
                """);
        }
    }
}
