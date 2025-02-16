/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("categories", (table) => {
      table.bigIncrements("id").primary();
      table.string("name").notNullable();
      table.bigInteger("parent_id").unsigned().nullable(); // Crear la columna sin la clave foránea en este paso
      table.boolean("is_active").defaultTo(true);
    })
    .then(() => {
      return knex.schema.alterTable("categories", (table) => {
        table
          .foreign("parent_id")
          .references("id")
          .inTable("categories")
          .onDelete("CASCADE");
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("categories", (table) => {
      table.dropForeign(["parent_id"]);
    })
    .then(() => {
      return knex.schema.dropTable("categories");
    });
};
