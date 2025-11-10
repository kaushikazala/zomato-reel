const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFoodItem(req, res) {
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  ); //video data

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "Food item created successfully",
    foodItem: foodItem,
  });
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({});
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    });
}

module.exports = { createFoodItem , getFoodItems };
