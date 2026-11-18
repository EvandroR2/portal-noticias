using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortalNoticias.Data.Migrations.Noticias
{
    public partial class BaselineNoticias : Migration
    {
        protected override void Up(
            MigrationBuilder migrationBuilder)
        {
            // A tabela noticias já existe no banco.
        }

        protected override void Down(
            MigrationBuilder migrationBuilder)
        {
            // A baseline não deve apagar a tabela existente.
        }
    }
}