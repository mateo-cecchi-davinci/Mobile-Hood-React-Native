/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 255).notNullable();
    table.string("lastname", 255).notNullable();
    table.string("email").unique().notNullable();
    table.timestamp("email_verified_at").nullable();
    table.string("password").notNullable();
    table.integer("phone").notNullable();
    table.boolean("is_admin").defaultTo(false);
    table.boolean("is_partner").defaultTo(false);
    table.string("remember_token").nullable();
    table.timestamps(true, true);
    table.boolean("is_active").defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
