const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const businesses = [
  {
    name: "Lo de Hugo",
    logo: "butcher_shops/hugo.png",
    street: "Liniers",
    number: 483,
    category: "butcher_shop",
    fk_businesses_users: 2,
    frontPage: "butcher_shops/loDeHugo.jpg",
    metaData: "butcher_shops",
  },
  {
    name: "Los Chinitos",
    logo: "butcher_shops/los_chinitos.png",
    street: "Libertador",
    number: 1000,
    category: "butcher_shop",
    fk_businesses_users: 3,
    frontPage: "butcher_shops/losChinitos.jpg",
    metaData: "butcher_shops",
  },
  {
    name: "La Verdura",
    logo: "grocery_stores/la_verdura.png",
    street: "La Plata",
    number: 255,
    category: "grocery_store",
    fk_businesses_users: 4,
    frontPage: "grocery_stores/laVerdura.jpg",
    metaData: "grocery_stores",
  },
  {
    name: "Verdulería Peñaflor",
    logo: "grocery_stores/verduleria_peñaflor.png",
    street: "Libertador",
    number: 5936,
    category: "grocery_store",
    fk_businesses_users: 5,
    frontPage: "grocery_stores/verduleriaPeñaflor.jpg",
    metaData: "grocery_stores",
  },
  {
    name: "D'agostino",
    logo: "wineries/d_agostino.png",
    street: "Colon",
    number: 770,
    category: "winery",
    fk_businesses_users: 6,
    frontPage: "wineries/dagostino.jpg",
    metaData: "wineries",
  },
  {
    name: "Dupont",
    logo: "wineries/dupont.png",
    street: "Mariano Acha",
    number: 2170,
    category: "winery",
    fk_businesses_users: 7,
    frontPage: "wineries/dupont.jpg",
    metaData: "wineries",
  },
];

const generateUniqueFileName = (originalFileName) => {
  const hash = crypto.createHash("sha256");
  hash.update(originalFileName + Date.now().toString());
  return hash.digest("hex") + path.extname(originalFileName);
};

exports.seed = async function (knex) {
  try {
    for (const business of businesses) {
      const uniqueFileName = generateUniqueFileName(business.logo);
      const uniqueFrontFileName = generateUniqueFileName(business.frontPage);

      // Directorio donde se guardarán las imágenes
      const uploadDir = path.join(
        __dirname,
        "..",
        "uploads",
        "business_logos",
        business.metaData
      );

      const uploadFrontsDir = path.join(
        __dirname,
        "..",
        "uploads",
        "business_front_pages",
        business.metaData
      );

      if (!fs.existsSync(uploadDir)) {
        console.log(`Creating directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (!fs.existsSync(uploadFrontsDir)) {
        console.log(`Creating directory: ${uploadFrontsDir}`);
        fs.mkdirSync(uploadFrontsDir, { recursive: true });
      }

      // Ruta original de la imagen
      const originalImagePath = path.join(
        __dirname,
        "..",
        "app",
        "assets",
        "business_logos",
        business.logo
      );

      const originalFrontImagePath = path.join(
        __dirname,
        "..",
        "app",
        "assets",
        "business_front_pages",
        business.frontPage
      );

      console.log("Original image path:", originalImagePath);
      console.log("Original image path:", originalFrontImagePath);

      if (!fs.existsSync(originalImagePath)) {
        console.error(`File not found: ${originalImagePath}`);
        continue;
      }

      if (!fs.existsSync(originalFrontImagePath)) {
        console.error(`File not found: ${originalFrontImagePath}`);
        continue;
      }

      // Copiar la imagen con nombre encriptado
      const newImagePath = path.join(uploadDir, uniqueFileName);
      fs.copyFileSync(originalImagePath, newImagePath);

      const newFrontImagePath = path.join(uploadFrontsDir, uniqueFrontFileName);
      fs.copyFileSync(originalFrontImagePath, newFrontImagePath);

      // Insertar en la base de datos
      await knex("businesses").insert({
        name: business.name,
        logo: `business_logos/${uniqueFileName}`,
        street: business.street,
        number: business.number,
        category: business.category,
        fk_businesses_users: business.fk_businesses_users,
        frontPage: `business_front_pages/${uniqueFrontFileName}`,
      });

      console.log(`${business.name} added successfully!`);
    }

    console.log("All businesses seeded successfully!");
  } catch (error) {
    console.error("Error seeding businesses:", error);
  }
};
