import prisma from "../config/db.js";

export const createModel = async (req, res) => {
  const { name, fields } = req.body;

  try {
    // Create the model entry in Prisma
    const model = await prisma.model.create({
      data: {
        name,
        fields: {
          create: fields.map((field) => ({
            name: field.name,
            type: field.type,
          })),
        },
      },
    });

    // ✅ Generate SQL Query to Create Table
    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${name} (id INT AUTO_INCREMENT PRIMARY KEY, ${fields
      .map((field) => `${field.name} ${getSQLType(field.type)}`)
      .join(",\n")})`;

    // Execute the query
    await prisma.$executeRawUnsafe(createTableSQL);

    res.json({ success: true, model });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating model", details: error.message });
  }
};

export const getAllModels = async (req, res) => {
  try {
    const models = await prisma.model.findMany({ include: { fields: true } });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getModelById = async (req, res) => {
  try {
    const models = await prisma.model.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { fields: true },
    });

    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    await prisma.field.deleteMany({
      where: { modelId: parseInt(req.params.id) },
    });
    await prisma.model.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};