exports.seed = async function (knex) {
  // Truncate the table before seeding
  await knex("locations").del();

  for (let i = 1; i < 7; i++) {
    await knex("locations").insert([
      {
        lat: -34.4376063,
        lng: -58.5625781,
        fk_locations_businesses: i,
      },
    ]);
  }
};
