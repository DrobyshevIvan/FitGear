using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitGear.Data.Migrations
{
    /// <inheritdoc />
    public partial class Did_CategoryId_NonNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Announcements",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "b47aefe9-c1c6-464e-b08f-b6d0df2c8e9c", null, "Administrator", "ADMINISTRATOR" },
                    { "d1c5844f-8678-4c8d-8bc0-c150ca8cd034", null, "Moderator", "MODERATOR" },
                    { "d8e75492-e55b-4738-8b3f-54770bb725e6", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b47aefe9-c1c6-464e-b08f-b6d0df2c8e9c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d1c5844f-8678-4c8d-8bc0-c150ca8cd034");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d8e75492-e55b-4738-8b3f-54770bb725e6");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Announcements",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "08a1d5cc-6679-4ae8-aff8-50b1a158e308", null, "User", "USER" },
                    { "5dd3169c-8d50-46de-85af-ec3391ca78ee", null, "Administrator", "ADMINISTRATOR" },
                    { "9b8ee193-70d1-42eb-95cb-44c5b1c5b9d5", null, "Moderator", "MODERATOR" }
                });
        }
    }
}
