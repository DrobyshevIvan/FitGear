using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitGear.Migrations
{
    /// <inheritdoc />
    public partial class AddedEnumsForStatusFor_Booking_Payment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5d0e2598-e5bd-4162-bd8b-cf98d6e99696");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "aae9c953-57f2-4da6-a0ac-4233f57e8f66");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fc90660c-6ddf-41f0-a247-19e623048062");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2e78215d-c1b7-4313-b523-4725d97bfe31", null, "Moderator", "MODERATOR" },
                    { "4d5737e8-1000-47a4-b573-a40950bec33e", null, "User", "USER" },
                    { "c99a02c6-f4b0-4a34-84f4-d279082d8be0", null, "Administrator", "ADMINISTRATOR" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2e78215d-c1b7-4313-b523-4725d97bfe31");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4d5737e8-1000-47a4-b573-a40950bec33e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c99a02c6-f4b0-4a34-84f4-d279082d8be0");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5d0e2598-e5bd-4162-bd8b-cf98d6e99696", null, "User", "USER" },
                    { "aae9c953-57f2-4da6-a0ac-4233f57e8f66", null, "Administrator", "ADMINISTRATOR" },
                    { "fc90660c-6ddf-41f0-a247-19e623048062", null, "Moderator", "MODERATOR" }
                });
        }
    }
}
