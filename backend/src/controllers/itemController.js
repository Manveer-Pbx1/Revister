const Item = require('../models/item');

exports.saveUrl = async (req, res) => {
  try {
    const { name, url, notes, difficulty, completed, saved, revisitCount } = req.body;

    if (!url || !notes || !difficulty) {
      return res.status(400).send("URL, notes, and difficulty are required");
    }

    const newItem = await Item.create({
      name,
      url,
      notes,
      difficulty,
      completed: completed || false,
      saved: saved || true,
      revisitCount: revisitCount || 0
    });

    console.log("Item saved:", newItem.id);
    res.status(200).send(newItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).send("Internal server error");
  }
};

exports.getAllUrls = async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [['date', 'DESC']]
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal server error");
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const id = req.params.id;
    const { url, notes, difficulty, completed, saved, revisitCount } = req.body;

    if (!url || !notes || !difficulty) {
      return res.status(400).send("URL, notes, and difficulty are required");
    }

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).send("Item not found");
    }

    await item.update({
      url,
      notes,
      difficulty,
      completed,
      saved,
      revisitCount
    });

    console.log("Item updated:", id);
    res.status(200).send(item);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("Internal server error");
  }
}; 