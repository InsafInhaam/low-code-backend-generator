export const createDymanicRoute = async (req, res) => {
  const data = req.body;
  try {
    const newRecord = await prisma.$executeRawUnsafe(
      `INSERT INTO ${routeName} (${fields
        .map((f) => f.name)
        .join(", ")}) VALUES (${fields
        .map((f) => `'${data[f.name]}'`)
        .join(", ")})`
    );
    res.json({ success: true, newRecord });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating record", details: error.message });
  }
};

export const readdAllDynamicRoute = async (req, res) => {
  try {
    const records = await prisma.$queryRawUnsafe(`SELECT * FROM ${routeName}`);
    res.json({ success: true, records });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching records", details: error.message });
  }
};

export const readOneDynamicRoute = async (req, res) => {
  try {
    const record = await prisma.$queryRawUnsafe(
      `SELECT * FROM ${routeName} WHERE id = ${Number(req.params.id)}`
    );
    res.json({ success: true, record });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching record", details: error.message });
  }
};

export const updateDynamicRoute = async (req, res) => {
  const data = req.body;
  try {
    const updateQuery = `UPDATE ${routeName} SET ${Object.keys(data)
      .map((key) => `${key} = '${data[key]}'`)
      .join(", ")} WHERE id = ${Number(req.params.id)}`;
    await prisma.$executeRawUnsafe(updateQuery);
    res.json({ success: true, message: "Record updated" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating record", details: error.message });
  }
};

export const deleteDynamicRoute = async (req, res) => {
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM ${routeName} WHERE id = ${Number(req.params.id)}`
    );
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting record", details: error.message });
  }
};
