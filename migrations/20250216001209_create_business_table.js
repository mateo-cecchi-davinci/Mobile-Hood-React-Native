/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("businesses", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 255).notNullable();
    table.string("logo", 255).notNullable();
    table.string("frontPage", 255).notNullable();
    table.string("street", 255).notNullable();
    table.integer("number").notNullable();
    table.string("category", 255).notNullable();
    table.bigInteger("fk_businesses_users").unsigned().notNullable();
    table
      .foreign("fk_businesses_users")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamps(true, true);
    table.boolean("is_active").defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("businesses", (table) => {
      table.dropForeign(["fk_businesses_users"]);
    })
    .then(() => {
      return knex.schema.dropTable("businesses");
    });
};
