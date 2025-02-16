/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("carts", (table) => {
    table.increments("id").primary(); // Crear columna 'id' como autoincrementable

    table.bigInteger("fk_carts_users").unsigned().notNullable(); // Crear columna de clave foránea hacia 'users'

    table
      .foreign("fk_carts_users")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Si un usuario se elimina, se eliminan los registros del carrito

    table.bigInteger("fk_carts_products").unsigned().notNullable(); // Crear columna de clave foránea hacia 'products'

    table
      .foreign("fk_carts_products")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE"); // Si un producto se elimina, se eliminan los registros del carrito

    table.integer("quantity").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("carts", (table) => {
      table.dropForeign(["fk_carts_users"]); // Eliminar la clave foránea 'fk_carts_users'
      table.dropForeign(["fk_carts_products"]); // Eliminar la clave foránea 'fk_carts_products'
    })
    .then(() => {
      return knex.schema.dropTableIfExists("carts"); // Eliminar la tabla 'carts'
    });
};
