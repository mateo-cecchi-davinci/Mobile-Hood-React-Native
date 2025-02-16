/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // Crear tabla 'orders'
  return knex.schema
    .createTable("orders", (table) => {
      table.bigIncrements("id").primary();
      table.string("state").notNullable();
      table.double("payment").notNullable();
      table.bigInteger("fk_orders_users").unsigned().notNullable();
      table
        .foreign("fk_orders_users")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
      table.boolean("is_active").defaultTo(true);
      table.integer("business_id");
    })
    .then(() => {
      return knex.schema.createTable("orders_products", (table) => {
        table.bigInteger("fk_orders_products_orders").unsigned().notNullable();
        table
          .bigInteger("fk_orders_products_products")
          .unsigned()
          .notNullable();
        table.integer("amount").notNullable();
        table
          .foreign("fk_orders_products_orders")
          .references("id")
          .inTable("orders")
          .onDelete("CASCADE");
        table
          .foreign("fk_orders_products_products")
          .references("id")
          .inTable("products")
          .onDelete("CASCADE");
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Eliminar claves foráneas antes de eliminar las tablas
  return knex.schema
    .alterTable("orders_products", (table) => {
      table.dropForeign(["fk_orders_products_orders"]);
      table.dropForeign(["fk_orders_products_products"]);
    })
    .then(() => {
      return knex.schema
        .alterTable("orders", (table) => {
          table.dropForeign(["fk_orders_users"]);
        })
        .then(() => {
          // Eliminar tablas
          return knex.schema.dropTable("orders_products");
        })
        .then(() => {
          return knex.schema.dropTable("orders");
        });
    });
};
