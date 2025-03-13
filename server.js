require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("knex");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = knex(require("./knexfile.js"));
const app = express();

const { body, validationResult } = require("express-validator");
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado, token requerido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

app.post(
  "/login",
  [
    body("email").isEmail().notEmpty(),
    body("password").isString().isLength({ min: 8 }).notEmpty(),
  ],
  async (req, res) => {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Buscar usuario en la base de datos
      const user = await db("users")
        .select("id", "name", "lastname", "email", "phone", "password")
        .where({ email })
        .first();

      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Comparar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          phone: user.phone,
        },
        SECRET_KEY,
        { expiresIn: "7d" } // Token válido por 7 días
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
);

app.post(
  "/signIn",
  [
    body("name").isString().isLength({ max: 255 }).notEmpty(),
    body("lastname").isString().isLength({ max: 255 }).notEmpty(),
    body("email").isEmail().isLength({ max: 255 }).notEmpty(),
    body("phone").trim().isLength({ min: 7, max: 15 }).notEmpty(), // Permitir teléfonos como string
    body("password").isString().isLength({ min: 8 }).notEmpty(),
  ],
  async (req, res) => {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, lastname, email, phone, password } = req.body;

      // Verificar si el usuario ya existe
      const user = await db("users")
        .select("id")
        .where({ email: email, is_active: 1 })
        .first();

      if (user) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10); // 10 es el saltRounds

      // Insertar usuario en la base de datos
      const [newUser] = await db("users").insert(
        {
          name,
          lastname,
          email,
          phone,
          password: hashedPassword,
        },
        ["id", "name", "lastname", "email"]
      );

      res.status(201).json({
        message: "Usuario creado con éxito",
        user: newUser,
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
);

app.post("/editPersonalInfo", verifyToken, async (req, res) => {
  try {
    const { id, name, lastname } = req.body;

    await db("users").where({ id }).update({ name, lastname });

    const user = await db("users").where({ id }).first();

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

app.get("/businesses", async (req, res) => {
  try {
    const businesses = await db("businesses").select("*");
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener negocios" });
  }
});

app.post("/business/:id", async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del negocio desde la URL

    // Obtener el negocio
    const business = await db("businesses")
      .select("id", "name", "logo", "frontPage", "street", "number", "category")
      .where({ id, is_active: 1 })
      .first();

    if (!business) {
      return res.status(404).json({ error: "Negocio no encontrado" });
    }

    // Obtener categorías activas del negocio
    const categories = await db("categories")
      .select("id", "name", "parent_id")
      .where({ fk_categories_businesses: id, is_active: 1 });

    // Obtener productos de cada categoría
    const products = await db("products")
      .select(
        "id",
        "model",
        "image",
        "description",
        "price",
        "brand",
        "stock",
        "fk_products_categories"
      )
      .whereIn(
        "fk_products_categories",
        categories.map((cat) => cat.id)
      )
      .andWhere({ is_active: 1 });

    // Organizar los productos dentro de sus respectivas categorías
    const categoriesWithProducts = categories.map((category) => ({
      ...category,
      products: products.filter(
        (product) => product.fk_products_categories === category.id
      ),
    }));

    return res.json({
      business,
      categories: categoriesWithProducts,
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error al obtener los datos del negocio" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await db("products").select("*");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Iniciar el servidor
const PORT = process.env.DB_PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
