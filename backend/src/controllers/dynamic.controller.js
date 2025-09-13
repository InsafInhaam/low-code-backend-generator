import pool from "../config/db.js";

export const createRecord = async (req, res) => {
  const { model } = req.params;
  const data = req.body;

  try {
    const fields = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((val) => `'${val}'`)
      .join(", ");

    const query = `INSERT INTO ${model} (${fields}) VALUES (${values})`;

    await pool.query(query);

    res.json({ success: true, message: `Record added to ${model}.` });
  } catch (error) {
    res.status(500).json({
      error: "Error inserting record",
      details: error,
      message,
    });
  }
};

export const getAllRecords = async (req, res) => {
  const { model } = req.params;

  try {
    const [records] = await pool.query(`SELECT * FROM ${model}`);
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching records",
      details: error.message,
    });
  }
};

export const getSingleRecord = async (req, res) => {
  const { model, id } = req.params;

  try {
    const [record] = await pool.query(`SELECT * FROM ${model} WHERE id = ?`, [
      id,
    ]);

    if (record.length === 0) {
      return res.status(404).json({
        error: "Record not found",
      });
    }

    res.json({ success: true, record: record[0] });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching record",
      details: error.message,
    });
  }
};

export const updateRecord = async (req, res) => {
  const { model, id } = req.params;
  const data = req.body;
  try {
    const updates = Object.keys(data)
      .map((key) => `${key} = '${data[key]}'`)
      .join(", ");

    const query = `UPDATE ${model} SET ${updates} WHERE id = ?`;

    await pool.query(query, [id]);

    res.json({ success: true, message: "Record updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error fetching record", details: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  const {model, id} = req.params;

  try {
    await pool.query(`DELETE FROM ${model} WHERE id = ?`, [id]);
    res.json({success: true, message: "Record deleted successfully." })
  } catch (error) {
    res.status(500).json({
      error: "Error deleting record",
      details: error.message,
    });
  }
};

// export const createDymanicRoute = async (req, res) => {
//   const data = req.body;
//   try {
//     const newRecord = await prisma.$executeRawUnsafe(
//       `INSERT INTO ${routeName} (${fields
//         .map((f) => f.name)
//         .join(", ")}) VALUES (${fields
//         .map((f) => `'${data[f.name]}'`)
//         .join(", ")})`
//     );
//     res.json({ success: true, newRecord });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error creating record", details: error.message });
//   }
// };

// export const createDymanicRoute = async (req, res) => {
//   const { model } = req.params;
//   const data = req.body;

//   try {
//     const modelExists = await prisma.model.findUnique({
//       where: { name: model },
//     });

//     if (!modelExists) {
//       return res
//         .status(400)
//         .json({ error: `Model '${model}' does not exist.` });
//     }

//     // Construct safe insert query
//     const fields = Object.keys(data);
//     const values = Object.values(data)
//       .map((val) => `'${val}`)
//       .join(", ");

//     const query = `INSERT INTO ${model} (${fields.join(
//       ", "
//     )}) VALUES (${values})`;

//     await prisma.$executeRawUnsafe(query);

//     res.join({ success: true, message: `Record added to ${model}.` });
//   } catch (error) {
//     res.status(500).json({error: "Error creating record", details: error.message});
//   }
// };

// export const readdAllDynamicRoute = async (req, res) => {
//   try {
//     const records = await prisma.$queryRawUnsafe(`SELECT * FROM ${routeName}`);
//     res.json({ success: true, records });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching records", details: error.message });
//   }
// };

// export const readdAllDynamicRoute = async (req, res) => {
//   const { modelName } = req.params; // Extract model name from the route
//   try {
//     const records = await prisma.$queryRawUnsafe(`SELECT * FROM ${modelName}`);
//     res.json({ success: true, records });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching records", details: error.message });
//   }
// };

// export const readOneDynamicRoute = async (req, res) => {
//   try {
//     const record = await prisma.$queryRawUnsafe(
//       `SELECT * FROM ${routeName} WHERE id = ${Number(req.params.id)}`
//     );
//     res.json({ success: true, record });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching record", details: error.message });
//   }
// };

// export const updateDynamicRoute = async (req, res) => {
//   const data = req.body;
//   try {
//     const updateQuery = `UPDATE ${routeName} SET ${Object.keys(data)
//       .map((key) => `${key} = '${data[key]}'`)
//       .join(", ")} WHERE id = ${Number(req.params.id)}`;
//     await prisma.$executeRawUnsafe(updateQuery);
//     res.json({ success: true, message: "Record updated" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error updating record", details: error.message });
//   }
// };

// export const deleteDynamicRoute = async (req, res) => {
//   try {
//     await prisma.$executeRawUnsafe(
//       `DELETE FROM ${routeName} WHERE id = ${Number(req.params.id)}`
//     );
//     res.json({ success: true, message: "Record deleted" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error deleting record", details: error.message });
//   }
// };
