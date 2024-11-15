const db = require("../../DB/models");
const Agency = db.agencies;
const Trainee = db.trainees;
const Cart = db.carts;
const Bought = db.boughts;
const Transaction = db.transactions;

module.exports.addItem = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorized Request",
    });
  }

  const trainee_id = req.body.trainee_id;
  const agency_id = req.user.id;

  try {
    // Check if the trainee is already bought
    const isBought = await Bought.findOne({
      where: { trainee_id: trainee_id },
    });

    if (isBought) {
      return res.status(400).json({
        message: "Trainee has already been bought and cannot be added to cart.",
      });
    }

    // Check if the trainee is already in the cart for the same agency
    const existingCart = await Cart.findOne({
      where: {
        trainee_id: trainee_id,
        agency_id: agency_id,
      },
    });

    if (existingCart) {
      return res.status(200).json({
        message: "Trainee is already in the cart.",
      });
    }

    // If not already bought or in the cart, create a new cart entry
    const cart = await Cart.create({
      trainee_id: trainee_id,
      agency_id: agency_id,
    });

    return res.status(201).json({
      message: "Added trainee to cart successfully!",
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
module.exports.deleteItem = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }
  await Cart.destroy({
    where: {
      agency_id: req.user.id, // Replace with the specific agency ID
      trainee_id: req.body.trainee,
    },
  });
};

module.exports.getItems = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }

  try {
    cart = await Agency.findByPk(req.user.id, {
      attributes: [],
      include: [
        {
          model: Trainee,
          attributes: { exclude: ["phone", "email", "aadhar"] }, // Select only the name attribute
          through: { attributes: [] },
          as: "trainees",
        },
      ],
    });

    res.status(200).json({
      cart,
      message: "Returned Cart Items",
      num_of_items: cart.trainees.length,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal Server Error, Please try after some time" });
  }
};

module.exports.deleteAll = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }

  await Cart.destroy({
    where: {
      agency_id: req.user.id, // Replace with the specific agency ID
    },
  });
};

module.exports.checkout = (req, res) => {};
