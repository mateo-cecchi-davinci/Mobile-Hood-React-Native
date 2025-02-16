const hugo_hours = [
  {
    day_of_week: 0,
    opening_time: "07:00:00",
    closing_time: "13:00:00",
    fk_business_hours_business: 1,
  },
  {
    day_of_week: 3,
    opening_time: "07:00:00",
    closing_time: "15:00:00",
    fk_business_hours_business: 1,
  },
  {
    day_of_week: 4,
    opening_time: "07:00:00",
    closing_time: "15:00:00",
    fk_business_hours_business: 1,
  },
  {
    day_of_week: 5,
    opening_time: "07:00:00",
    closing_time: "18:00:00",
    fk_business_hours_business: 1,
  },
  {
    day_of_week: 6,
    opening_time: "07:00:00",
    closing_time: "18:00:00",
    fk_business_hours_business: 1,
  },
];

exports.seed = async function (knex) {
  // Truncate the table before seeding
  await knex("business_hours").del();

  await knex("business_hours").insert(hugo_hours);

  for (let i = 0; i < 7; i++) {
    // Insert business_hours
    await knex("business_hours").insert([
      {
        day_of_week: i,
        opening_time: "07:00:00",
        closing_time: "18:00:00",
        fk_business_hours_business: 2,
      },
    ]);
  }

  for (let i = 0; i < 7; i++) {
    // Insert business_hours
    await knex("business_hours").insert([
      {
        day_of_week: i,
        opening_time: "07:00:00",
        closing_time: "18:00:00",
        fk_business_hours_business: 3,
      },
    ]);
  }

  for (let i = 0; i < 7; i++) {
    // Insert business_hours
    await knex("business_hours").insert([
      {
        day_of_week: i,
        opening_time: "07:00:00",
        closing_time: "18:00:00",
        fk_business_hours_business: 4,
      },
    ]);
  }

  for (let i = 0; i < 7; i++) {
    // Insert business_hours
    await knex("business_hours").insert([
      {
        day_of_week: i,
        opening_time: "07:00:00",
        closing_time: "18:00:00",
        fk_business_hours_business: 5,
      },
    ]);
  }

  for (let i = 0; i < 7; i++) {
    // Insert business_hours
    await knex("business_hours").insert([
      {
        day_of_week: i,
        opening_time: "07:00:00",
        closing_time: "18:00:00",
        fk_business_hours_business: 6,
      },
    ]);
  }
};
