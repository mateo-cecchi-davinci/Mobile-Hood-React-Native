/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("locations", (table) => {
    table.bigIncrements("id").primary(); // Crear columna 'id' como autoincrementable
    table.float("lat", 10, 7); // Crear columna 'lat' con 10 dígitos y 7 decimales
    table.float("lng", 10, 7); // Crear columna 'lng' con 10 dígitos y 7 decimales
    table
      .bigInteger("fk_locations_businesses")
      .unsigned()
      .unique() // La columna será única
      .notNullable();

    // Establecer la relación con la tabla 'businesses'
    table
      .foreign("fk_locations_businesses")
      .references("id")
      .inTable("businesses")
      .onDelete("CASCADE"); // Si un negocio se elimina, la ubicación se elimina en cascada
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("locations", (table) => {
      table.dropForeign(["fk_locations_businesses"]); // Eliminar la clave foránea
    })
    .then(() => {
      return knex.schema.dropTableIfExists("locations"); // Eliminar la tabla 'locations'
    });
};
