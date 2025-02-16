/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("business_hours", (table) => {
      table.bigIncrements("id").primary();
      table.integer("day_of_week");
      table.time("opening_time");
      table.time("closing_time");
      table.bigInteger("fk_business_hours_business").unsigned().notNullable();

      table
        .foreign("fk_business_hours_business")
        .references("id")
        .inTable("businesses")
        .onDelete("CASCADE");
    })
    .then(() => {
      return knex.raw(
        "ALTER TABLE business_hours ADD CONSTRAINT chk_day_of_week CHECK (day_of_week BETWEEN 0 AND 6)"
      );
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("business_hours", (table) => {
      table.dropForeign(["fk_business_hours_business"]); // Eliminar la clave foránea
    })
    .then(() => {
      return knex.schema.dropTableIfExists("business_hours"); // Eliminar la tabla 'business_hours'
    });
};
