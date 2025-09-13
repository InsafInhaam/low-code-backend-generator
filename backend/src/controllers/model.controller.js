import pool from "../config/db.js";

function getSQLType(type) {
  const typeMapping = {
    String: "VARCHAR(255)", // Short text
    Text: "TEXT", // Large text
    LongText: "LONGTEXT", // Very large text
    Int: "INT", // Integer
    BigInt: "BIGINT", // Large integer
    Float: "FLOAT", // Decimal numbers
    Double: "DOUBLE", // More precision
    Decimal: "DECIMAL(10,2)", // Currency/precise numbers
    Boolean: "BOOLEAN", // True/False
    Date: "DATE", // Date only
    DateTime: "DATETIME", // Date and Time
    Time: "TIME", // Time only
    Timestamp: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", // Auto timestamp
    Json: "JSON", // Store JSON objects
    Image: "VARCHAR(500)", // Store image URL
    File: "VARCHAR(500)", // Store file URL
  };

  return typeMapping[type] || "TEXT"; // Default to TEXT if type is unknown
}

const sqlReservedWords = [
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "DELETE",
  "UPDATE",
  "TABLE",
  "DROP",
  "ALTER",
  "CREATE",
  "INDEX",
  "JOIN",
  "HAVING",
  "DISTINCT",
  "GROUP",
  "ORDER",
  "BY",
  "LIKE",
];

export const createModel = async (req, res) => {
  const { name, fields } = req.body;

  try {
    // Check if the table is protected
    if (process.env.PROTECTED_TABLES.includes(name.toLowerCase())) {
      return res
        .status(403)
        .json({ error: `Table '${name}' is protected and cannot be created.` });
    }

    // validate the table name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      return res.status(400).json({
        error:
          "Invalid table name. Only letters, numbers, and underscores are allowed.",
      });
    }

    // check if table exists
    const [existingTable] = await pool.query(`SHOW TABLES LIKE '${name}'`);

    if (existingTable.length > 0) {
      return res.status(400).json({
        error: "Table '${name}' already exists.",
      });
    }

    // validate field name & types
    for (const field of fields) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
        return res.status(400).json({
          error: `Invalid field name '${field.name}'. Only letters, numbers, and underscores are allowed.`,
        });
      }
      if (sqlReservedWords.includes(field.name.toUpperCase())) {
        return res.status(400).json({
          error: `Field name '${field.name}' is a reversed SQL keyword`,
        });
      }
      if (!getSQLType(field.type)) {
        return res.status(400).json({
          error: `Unsupported data type '${field.name}' for field '${field.name}'.`,
        });
      }
    }

    // generate create table SQL
    const createTableSQL = `
      CREATE TABLE ${name} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${fields
        .map((field) => `${field.name} ${getSQLType(field.type)}`)
        .join(",\n")}
      )
    `;

    await pool.query(createTableSQL);

    res.json({
      success: true,
      message: `Table '${name}' created successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating model",
      details: error.message,
    });
  }
};

export const getAllModels = async (req, res) => {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map((row) => Object.values(row)[0]);

    const dynamicTables = tableNames.filter(
      (table) => !process.env.PROTECTED_TABLES.includes(table.toLowerCase())
    );

    res.json({ success: true, models: dynamicTables });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching models", details: error.message });
  }
};

export const getModelById = async (req, res) => {
  const { name } = req.params;
  try {
    const [columns] = await pool.query(`DESCRIBE ${name}`);
    res.json({ success: true, model: { name, fields: columns } });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching model details", details: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    if (process.env.PROTECTED_TABLES.includes(name.toLowerCase())) {
      return res
        .status(403)
        .json({ error: `Table '${name}' is protected and cannot be deleted.` });
    }
    await pool.query(`DROP TABLE IF EXISTS ${name}`);
    res.json({
      success: true,
      message: `Table '${name}' deleted successfully.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting model", details: error.message });
  }
};



/** ✅ Helper Function to Convert Prisma Types to SQL Types */
// function getSQLType(prismaType) {
//   const typeMapping = {
//     String: "VARCHAR(255)",
//     Int: "INT",
//     Float: "FLOAT",
//     Boolean: "BOOLEAN",
//     DateTime: "DATETIME",
//   };

//   return typeMapping[prismaType] || "TEXT";
// }

// export const createModel = async (req, res) => {
//     const { name, fields } = req.body;
//     try {
//       // Create the model entry in Prisma
//       const model = await prisma.model.create({
//         data: {
//           name,
//           fields: {
//             create: fields.map((field) => ({
//               name: field.name,
//               type: field.type,
//             })),
//           },
//         },
//       });

//       // ✅ Generate SQL Query to Create Table
//       const createTableSQL = `
//           CREATE TABLE IF NOT EXISTS ${name} (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             ${fields
//               .map((field) => `${field.name} ${getSQLType(field.type)}`)
//               .join(",\n")}
//           )
//         `;

//       // Execute the query
//       await prisma.$executeRawUnsafe(createTableSQL);

//       res.json({ success: true, model });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "Error creating model", details: error.message });
//     }
// };

// export const createModel = async (req, res) => {
//   const { name, fields } = req.body;

//   try {
//     // ✅ 1. Check if model already exists
//     const existingModel = await prisma.model.findUnique({
//       where: { name },
//     });

//     if (existingModel) {
//       return res.status(400).json({
//         error: `Model '${name}' already exists. Choose a different name.`,
//       });
//     }

//     // ✅ 2. Create model entry in Prisma
//     const model = await prisma.model.create({
//       data: {
//         name,
//         fields: {
//           create: fields.map((field) => ({
//             name: field.name,
//             type: field.type,
//           })),
//         },
//       },
//     });

//     // ✅ 3. Generate SQL Query to Create Table
//     const createTableSQL = `
//       CREATE TABLE IF NOT EXISTS ${name} (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         ${fields
//           .map((field) => `${field.name} ${getSQLType(field.type)}`)
//           .join(",\n")}
//       )
//     `;

//     // ✅ 4. Execute the query
//     await prisma.$executeRawUnsafe(createTableSQL);

//     // ✅ 5. Append new model to `schema.prisma`
//     const fieldDefinitions = fields
//       .map((field) => `${field.name} ${field.type}`)
//       .join("\n  ");

//     const prismaModelDefinition = `
//     model ${name} {
//       id    Int    @id @default(autoincrement())
//       ${fieldDefinitions}
//     }`;

//     fs.appendFileSync("prisma/schema.prisma", prismaModelDefinition);

//     // ✅ 6. Run Prisma migration
//     exec(
//       `npx prisma migrate dev --name add_${name}`,
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error("Migration error:", stderr);
//           return res
//             .status(500)
//             .json({ error: "Migration failed", details: stderr });
//         }

//         res.json({ success: true, model });
//       }
//     );
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error creating model", details: error.message });
//   }
// };

// export const getAllModels = async (req, res) => {
//   try {
//     const models = await prisma.model.findMany({ include: { fields: true } });
//     res.json(models);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getModelById = async (req, res) => {
//   try {
//     const models = await prisma.model.findUnique({
//       where: { id: parseInt(req.params.id) },
//       include: { fields: true },
//     });

//     res.json(models);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const deleteModel = async (req, res) => {
//   try {
//     await prisma.field.deleteMany({
//       where: { modelId: parseInt(req.params.id) },
//     });
//     await prisma.model.delete({ where: { id: parseInt(req.params.id) } });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
