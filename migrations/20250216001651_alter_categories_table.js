/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // Alterar la tabla 'categories' para agregar la columna 'fk_categories_businesses'
  return knex.schema.table("categories", (table) => {
    table
      .bigInteger("fk_categories_businesses")
      .unsigned()
      .nullable()
      .after("parent_id");

    // Establecer la relación foránea con la tabla 'businesses'
    table
      .foreign("fk_categories_businesses")
      .references("id")
      .inTable("businesses")
      .onDelete("SET NULL"); // Opción de eliminación, puedes cambiar 'SET NULL' por otra opción
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Eliminar la relación foránea antes de eliminar la columna
  return knex.schema.table("categories", (table) => {
    table.dropForeign(["fk_categories_businesses"]);
    table.dropColumn("fk_categories_businesses");
  });
};
