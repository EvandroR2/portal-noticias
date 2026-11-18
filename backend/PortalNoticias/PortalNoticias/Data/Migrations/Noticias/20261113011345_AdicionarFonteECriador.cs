using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortalNoticias.Data.Migrations.Noticias
{
    /// <inheritdoc />
    public partial class AdicionarFonteECriador : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
        ALTER TABLE noticias
        ADD COLUMN IF NOT EXISTS criado_por uuid;
        """
            );

            migrationBuilder.Sql(
                """
        ALTER TABLE noticias
        ADD COLUMN IF NOT EXISTS fonte_url text;
        """
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
        ALTER TABLE noticias
        DROP COLUMN IF EXISTS criado_por;
        """
            );

            migrationBuilder.Sql(
                """
        ALTER TABLE noticias
        DROP COLUMN IF EXISTS fonte_url;
        """
            );
        }
    }
}
