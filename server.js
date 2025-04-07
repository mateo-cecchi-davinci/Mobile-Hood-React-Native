require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("knex");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const db = knex(require("./knexfile.js"));
const app = express();
const axios = require("axios");

const { body, validationResult } = require("express-validator");
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

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

const generateUniqueFileName = (originalFileName) => {
  const hash = crypto.createHash("sha256");
  hash.update(originalFileName + Date.now().toString());
  return hash.digest("hex") + path.extname(originalFileName);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, path.join(__dirname, "uploads", "business_logos"));
    } else if (file.fieldname === "frontPage") {
      cb(null, path.join(__dirname, "uploads", "business_front_pages"));
    } else if (file.fieldname === "image") {
      cb(null, path.join(__dirname, "uploads", "products"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueFileName = generateUniqueFileName(file.originalname);
    cb(null, uniqueFileName);
  },
});

// Middleware de `multer`
const upload = multer({ storage });

// Rutas
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

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
      const user = await db("users").where({ email }).first();

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
          is_partner: user.is_partner,
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
    const { user } = req.body; // Obtener el ID del usuario desde el cuerpo de la solicitud

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

    // Obtener productos del carrito del usuario para este negocio
    const cartProducts = await db("carts")
      .select(
        "fk_carts_users",
        "fk_carts_products",
        db.raw("SUM(quantity) as quantity")
      )
      .join("products", "carts.fk_carts_products", "=", "products.id")
      .join(
        "categories",
        "products.fk_products_categories",
        "=",
        "categories.id"
      )
      .where("fk_carts_users", user)
      .andWhere("categories.fk_categories_businesses", id)
      .groupBy("fk_carts_users", "fk_carts_products");

    return res.json({
      business,
      categories: categoriesWithProducts,
      cart: cartProducts,
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

app.post("/addToCart", async (req, res) => {
  try {
    const { fk_carts_products, fk_carts_users, quantity } = req.body;

    const existingCartItem = await db("carts")
      .where({ fk_carts_products, fk_carts_users })
      .first();

    if (existingCartItem) {
      await db("carts")
        .where({ fk_carts_products, fk_carts_users })
        .update({ quantity: existingCartItem.quantity + quantity });
    } else {
      await db("carts").insert({
        fk_carts_products,
        fk_carts_users,
        quantity,
      });
    }

    res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
});

app.post("/deleteSelected", async (req, res) => {
  try {
    const { selectedProducts, user, business } = req.body;

    for (const product of selectedProducts) {
      const { product_id, quantity } = product;
      const cartItem = await db("carts")
        .where({
          fk_carts_products: product_id,
          fk_carts_users: user,
        })
        .first();

      if (cartItem) {
        const newQuantity = cartItem.quantity - quantity;
        if (newQuantity > 0) {
          await db("carts")
            .where({
              fk_carts_products: product_id,
              fk_carts_users: user,
            })
            .update({ quantity: newQuantity });
        } else {
          await db("carts")
            .where({
              fk_carts_products: product_id,
              fk_carts_users: user,
            })
            .del();
        }
      }
    }

    const cartProducts = await db("carts")
      .select(
        "fk_carts_users",
        "fk_carts_products",
        db.raw("SUM(quantity) as quantity")
      )
      .join("products", "carts.fk_carts_products", "=", "products.id")
      .join(
        "categories",
        "products.fk_products_categories",
        "=",
        "categories.id"
      )
      .where("fk_carts_users", user)
      .andWhere("categories.fk_categories_businesses", business)
      .groupBy("fk_carts_users", "fk_carts_products");

    res.status(200).json({ cart: cartProducts });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res.status(500).json({ error: "Hubo un error" });
  }
});

app.post("/mpPaymentNotification", async (req, res) => {
  try {
    // Verificar si el payload contiene el ID del pago
    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: "ID de pago no proporcionado" });
    }

    // URL de la API de Mercado Pago para obtener los detalles del pago
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;

    // Realizar la solicitud GET a la API de Mercado Pago
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    const data = response.data;

    // Extraer los datos necesarios del pago
    const email = data.additional_info.payer.first_name;
    const payment = data.transaction_amount;
    const business = data.metadata.business;
    const items = data.additional_info.items;

    // Buscar el usuario en la base de datos
    const user = await db("users")
      .select("id")
      .where({ email, is_active: true })
      .first();

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear una nueva orden en la base de datos
    const [order] = await db("orders").insert(
      {
        state: "Pendiente",
        fk_orders_users: user.id,
        payment,
        created_at: new Date(),
        business_id: business.id,
      },
      ["id"]
    );

    // Procesar los productos de la orden
    for (const item of items) {
      const product = await db("products")
        .where({ id: item.id, is_active: true })
        .andWhere("stock", ">", 0)
        .first();

      if (product) {
        // Asociar el producto con la orden
        await db("orders_products").insert({
          fk_orders_products_orders: order,
          fk_orders_products_products: product.id,
          amount: item.quantity,
        });

        // Actualizar el stock del producto
        await db("products")
          .where({ id: product.id })
          .decrement("stock", item.quantity);

        // Eliminar el producto del carrito del usuario
        await db("carts")
          .where({ fk_carts_users: user.id, fk_carts_products: product.id })
          .del();
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Hubo un error" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const ordersWithDetails = await db("orders_products")
      .select(
        "orders_products.amount",
        "orders.id as order_id",
        "orders.state",
        "orders.payment",
        "orders.created_at",
        "orders.updated_at",
        "businesses.id as business_id",
        "businesses.name as business_name",
        "businesses.logo as business_logo",
        "businesses.frontPage as business_frontPage",
        "businesses.street as business_street",
        "businesses.number as business_number",
        db.raw(`(
          SELECT GROUP_CONCAT(CONCAT_WS('|||', 
            business_hours.day_of_week, 
            business_hours.opening_time, 
            business_hours.closing_time)
          ) 
          FROM business_hours 
          WHERE business_hours.fk_business_hours_business = businesses.id
        ) as business_hours`),
        "products.id as product_id",
        "products.model",
        "products.image as product_image",
        "products.description",
        "products.price"
      )
      .innerJoin(
        "orders",
        "orders_products.fk_orders_products_orders",
        "orders.id"
      )
      .innerJoin("businesses", "orders.business_id", "businesses.id")
      .innerJoin(
        "products",
        "orders_products.fk_orders_products_products",
        "products.id"
      )
      .where("orders.fk_orders_users", userId);

    // Procesar los resultados agrupando órdenes y productos
    const ordersMap = ordersWithDetails.reduce((acc, row) => {
      const orderId = row.order_id;

      if (!acc.has(orderId)) {
        acc.set(orderId, {
          id: orderId,
          state: row.state,
          payment: row.payment,
          created_at: row.created_at,
          updated_at: row.updated_at,
          business: {
            id: row.business_id,
            name: row.business_name,
            logo: row.business_logo,
            frontPage: row.business_frontPage,
            street: row.business_street,
            number: row.business_number,
            business_hours: row.business_hours
              ? row.business_hours.split(",").map((h) => {
                  const [day, open, close] = h.split("|||");
                  return {
                    day_of_week: parseInt(day),
                    opening_time: open,
                    closing_time: close,
                  };
                })
              : [],
          },
          products: [],
        });
      }

      const order = acc.get(orderId);
      order.products.push({
        id: row.product_id,
        model: row.model,
        image: row.product_image,
        description: row.description,
        price: row.price,
        amount: row.amount,
      });

      return acc;
    }, new Map());

    const orders_products = Array.from(ordersMap.values());

    res.json(orders_products);
  } catch (error) {
    console.error("Error en /orders:", error);
    res.status(500).json({
      error: "Error al obtener los pedidos",
      details: error.message,
    });
  }
});

app.post(
  "/signBusiness",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "frontPage", maxCount: 1 },
  ]),
  [
    body("businessName").isString().isLength({ max: 255 }).notEmpty(),
    body("street").isString().isLength({ max: 255 }).notEmpty(),
    body("number").isString().isLength({ max: 255 }).notEmpty(),
    body("lat")
      .matches(/^(-?\d+(\.\d+)?)$/)
      .withMessage("Latitud inválida"),
    body("lng")
      .matches(/^(-?\d+(\.\d+)?)$/)
      .withMessage("Longitud inválida"),
    body("email").isEmail().isLength({ max: 255 }).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { businessName, street, number, lat, lng, email } = req.body;

      const user = await db("users").where({ email }).first();

      if (user) {
        const logoPath = path.relative(
          path.join(__dirname, "uploads"),
          req.files.logo[0].path
        );
        const frontPagePath = path.relative(
          path.join(__dirname, "uploads"),
          req.files.frontPage[0].path
        );

        const [business] = await db("businesses").insert(
          {
            name: businessName,
            logo: logoPath,
            frontPage: frontPagePath,
            street,
            number,
            fk_businesses_users: user.id,
          },
          ["id"]
        );

        await db("locations").insert({
          lng,
          lat,
          fk_locations_businesses: business,
        });

        await db("users").where({ id: user.id }).update({ is_partner: 1 });

        res.status(201).json({
          message: "Negocio registrado con éxito",
        });
      } else {
        res.status(404).json({
          error: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Error",
        details: error.message,
      });
    }
  }
);

app.get("/dashboard/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const business = await db("businesses")
      .where({ fk_businesses_users: id })
      .then(async (businesses) => {
        return Promise.all(
          businesses.map(async (business) => {
            const categories = await db("categories")
              .where("fk_categories_businesses", business.id)
              .then(async (categories) => {
                return Promise.all(
                  categories.map(async (category) => {
                    const products = await db("products").where(
                      "fk_products_categories",
                      category.id
                    );
                    return { ...category, products };
                  })
                );
              });

            const orders = await db("orders").where("business_id", business.id);

            const business_hours = await db("business_hours").where(
              "fk_business_hours_business",
              business.id
            );

            return {
              ...business,
              categories,
              orders,
              business_hours,
            };
          })
        );
      });

    res.json(business[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error",
      details: error.message,
    });
  }
});

app.post("/editCategoryState", async (req, res) => {
  try {
    const { id, categoryState } = req.body;

    await db("categories").where({ id }).update({ is_active: categoryState });

    res.status(201).json({
      message: "Estado actualizado",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error",
      details: error.message,
    });
  }
});

app.post("/editProductState", async (req, res) => {
  try {
    const { id, productState } = req.body;

    await db("products").where({ id }).update({ is_active: productState });

    res.status(201).json({
      message: "Estado actualizado",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error",
      details: error.message,
    });
  }
});

app.post(
  "/addCategory",
  [body("name").isString().isLength({ max: 255 }).notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, business } = req.body;

      const existing = await db("categories")
        .where({ name, fk_categories_businesses: business })
        .first();

      if (existing) {
        return res.status(400).json({ error: "La categoría ya existe" });
      }

      await db("categories").insert({
        name,
        fk_categories_businesses: business,
      });

      const category = await db("categories")
        .orderBy("id", "desc")
        .select("*")
        .first();

      res.status(201).json({
        message: "Categoría creada con éxito",
        category: category,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Error",
        details: error.message,
      });
    }
  }
);

app.post(
  "/editCategory",
  [body("name").isString().isLength({ max: 255 }).notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, name } = req.body;

      await db("categories").where({ id }).update({ name });

      const category = await db("categories").select("*").where({ id }).first();

      res.status(201).json({
        message: "Categoría editada con éxito",
        category: category,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Error",
        details: error.message,
      });
    }
  }
);

app.post(
  "/addProduct",
  upload.fields([{ name: "image", maxCount: 1 }]),
  [
    body("model").isString().isLength({ max: 255 }).notEmpty(),
    body("description").isString().isLength({ max: 255 }).notEmpty(),
    body("brand").isString().isLength({ max: 255 }).notEmpty(),
    body("price").isString().isLength({ max: 255 }).notEmpty(),
    body("stock").isString().isLength({ max: 255 }).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { model, description, brand, price, stock, category } = req.body;

      const imagePath = path.relative(
        path.join(__dirname, "uploads"),
        req.files.image[0].path
      );

      const existing = await db("products")
        .where({ model, fk_products_categories: category })
        .first();

      if (existing) {
        return res.status(400).json({ error: "El producto ya existe" });
      }

      await db("products").insert({
        model,
        image: imagePath,
        description,
        brand,
        price: Number(price),
        stock,
        fk_products_categories: category,
      });

      const product = await db("products")
        .orderBy("id", "desc")
        .select("*")
        .first();

      res.status(201).json({
        message: "Producto creado con éxito",
        product: product,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Error",
        details: error.message,
      });
    }
  }
);

app.post("/deleteCategory", async (req, res) => {
  try {
    const { id } = req.body;

    const products = await db("products").where({ fk_products_categories: id });

    if (products.length > 0) {
      // Eliminar las imágenes de los productos
      for (const product of products) {
        const imagePath = path.join(__dirname, "uploads", product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Eliminar el archivo
        }
      }
    }

    await db("categories").where({ id }).del();

    res.status(200).json({
      message: "Categoría eliminada",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error",
      details: error.message,
    });
  }
});

app.post(
  "/editProduct",
  upload.fields([{ name: "image", maxCount: 1 }]),
  [
    body("model").isString().isLength({ max: 255 }).notEmpty(),
    body("description").isString().isLength({ max: 255 }).notEmpty(),
    body("brand").isString().isLength({ max: 255 }).notEmpty(),
    body("price").isString().isLength({ max: 255 }).notEmpty(),
    body("stock").isString().isLength({ max: 255 }).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, old_image, model, description, brand, price, stock } =
        req.body;

      let imagePath;

      if (!old_image) {
        const existingImage = await db("products")
          .select("image")
          .where({ id })
          .first();

        const existingImagePath = path.join(
          __dirname,
          "uploads",
          existingImage.image
        );
        if (fs.existsSync(existingImagePath)) {
          fs.unlinkSync(existingImagePath);
        }

        imagePath = path.relative(
          path.join(__dirname, "uploads"),
          req.files.image[0].path
        );
      } else {
        imagePath = old_image;
      }

      await db("products")
        .where({ id })
        .update({
          model,
          image: imagePath,
          description,
          brand,
          price: Number(price),
          stock,
        });

      res
        .status(201)
        .json({ message: "Producto editado con éxito", image: imagePath });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Error",
        details: error.message,
      });
    }
  }
);

// Iniciar el servidor
const PORT = process.env.DB_PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
