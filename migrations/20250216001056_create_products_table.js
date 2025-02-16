/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.bigIncrements("id").primary();
    table.string("model").notNullable();
    table.string("image").notNullable();
    table.string("description").notNullable();
    table.double("price").notNullable();
    table.string("brand").notNullable();
    table.integer("stock").notNullable();
    table.bigInteger("fk_products_categories").unsigned().notNullable();
    table
      .foreign("fk_products_categories")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.boolean("is_active").defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("products", (table) => {
      table.dropForeign(["fk_products_categories"]);
    })
    .then(() => {
      return knex.schema.dropTable("products");
    });
};
