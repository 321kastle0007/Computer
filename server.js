const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://Kastle:Kastle0007@inventory.yoh5i.mongodb.net/test?retryWrites=true&w=majority&appName=Inventory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the hardwareInfo schema for MongoDB
const hardwareInfoSchema = new mongoose.Schema({
  asset_id: String,
  cpu: Object,
  ram: Object,
  disks: Array,
  os: Object,
  gpu: Array,
  network: Object,
  battery: Object,
  software: Array,
  createdAt: Date,
  updatedAt: Date,
  is_changed: Boolean,
  changed_fields: Array,
});

const HardwareInfo = mongoose.model("HardwareInfo", hardwareInfoSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route to render asset details page
app.get("/asset/:asset_id", async (req, res) => {
  try {
    const assetId = req.params.asset_id;
    const assetData = await HardwareInfo.findOne({ asset_id: assetId });

    if (assetData) {
      res.render("asset", { asset: assetData });
    } else {
      res.status(404).send("Asset not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Route to render edit asset page
app.get("/asset/:asset_id/edit", async (req, res) => {
  try {
    const assetId = req.params.asset_id;
    const assetData = await HardwareInfo.findOne({ asset_id: assetId });

    if (assetData) {
      // Provide random substitutes for dropdowns
      const substitutes = {
        os: ["Windows 11", "Ubuntu 20.04"],
        cpu: ["Intel i7", "AMD Ryzen 5"],
        ram: ["8GB", "16GB"],
        network: ["192.168.1.1", "192.168.1.100"],
        disks: ["SSD 500GB", "HDD 1TB"],
      };

      res.render("editasset", { asset: assetData, substitutes });
    } else {
      res.status(404).send("Asset not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Route to handle asset updates
app.post("/asset/:asset_id/update", async (req, res) => {
  try {
    const assetId = req.params.asset_id;
    const updates = req.body;

    const updatedAsset = await HardwareInfo.findOneAndUpdate(
      { asset_id: assetId },
      { ...updates, updatedAt: new Date(), is_changed: true },
      { new: true }
    );

    if (updatedAsset) {
      res.redirect(`/asset/${assetId}`);
    } else {
      res.status(404).send("Asset not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
