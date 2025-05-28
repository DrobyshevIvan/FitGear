using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitGear.Data.Migrations
{
    /// <inheritdoc />
    public partial class added_category_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "03babc1b-1031-4ecc-b504-eb1c3c0ada58");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5a0e11f9-6c3c-4602-aaf5-f7ee4ce7754a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4252df7-a608-4d85-a193-373a4e43b08a");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Announcements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Announcements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Announcements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "08a1d5cc-6679-4ae8-aff8-50b1a158e308", null, "User", "USER" },
                    { "5dd3169c-8d50-46de-85af-ec3391ca78ee", null, "Administrator", "ADMINISTRATOR" },
                    { "9b8ee193-70d1-42eb-95cb-44c5b1c5b9d5", null, "Moderator", "MODERATOR" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_CategoryId",
                table: "Announcements",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_Categories_CategoryId",
                table: "Announcements",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_Categories_CategoryId",
                table: "Announcements");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Announcements_CategoryId",
                table: "Announcements");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "08a1d5cc-6679-4ae8-aff8-50b1a158e308");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5dd3169c-8d50-46de-85af-ec3391ca78ee");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9b8ee193-70d1-42eb-95cb-44c5b1c5b9d5");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Announcements");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "03babc1b-1031-4ecc-b504-eb1c3c0ada58", null, "User", "USER" },
                    { "5a0e11f9-6c3c-4602-aaf5-f7ee4ce7754a", null, "Administrator", "ADMINISTRATOR" },
                    { "f4252df7-a608-4d85-a193-373a4e43b08a", null, "Moderator", "MODERATOR" }
                });
        }
    }
}
