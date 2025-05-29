using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitGear.Data.Migrations
{
    /// <inheritdoc />
    public partial class Added_DefaultValue_For_IsDeleted_In_Announcements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Announcements",
                type: "bit",
                nullable: true,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "129bf042-1478-4968-b161-51f62de0f62e", null, "User", "USER" },
                    { "17855cb3-f1bd-46db-b493-c60b627ed139", null, "Administrator", "ADMINISTRATOR" },
                    { "c6acafa8-0252-4005-8439-fcd9d76ec1a4", null, "Moderator", "MODERATOR" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "129bf042-1478-4968-b161-51f62de0f62e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "17855cb3-f1bd-46db-b493-c60b627ed139");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c6acafa8-0252-4005-8439-fcd9d76ec1a4");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Announcements",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: false);

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
    }
}
