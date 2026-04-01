const { Order, OrderItem, Food, User } = require("../models");

// -------------------------- FETCH FOOD PARTNER BY ID -------------------------

async function fetchFoodPartnerById(id) {
  const fp = await User.findOne({
    where: { id, role: "food_partner" },
    attributes: ["id", "fullName", "email", "role", "profileImage", "status"],
  });
  if (!fp) return null;

  const foods = await Food.findAll({
    where: { foodPartnerId: id },
    attributes: ["id", "name", "description", "category", "price", "video", "likeCount", "savesCount", "createdAt"]
  });

  return { ...fp.toJSON(), foods };
}

// -------------------------- Get Food Order service -------------------------
async function getFoodOrdersService(foodPartnerId) {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: 'items',
        required: true,
        include: [
          {
            model: Food,
            as: 'food',
            where: { foodPartnerId },
            attributes: ["id", "name", "price", "video"]
          }
        ]
      },
      { model: User, as: "user", attributes: ["id", "fullName"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  return orders;
}

// -------------------------- GET FOOD PARTNER PROFILE -------------------------

async function fetchFoodPartnerProfile(userId) {
  const user = await User.findByPk(userId);

  if (!user || user.role !== "food_partner") {
    throw new Error("Food partner not found");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,

    openingTime: user.openingTime,
    closingTime: user.closingTime,

    status: user.status,
    isOtpVerified: user.isOtpVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ------------------------- UPDATE FOOD PARTNER PROFILE -------------------------
async function updateFoodPartnerProfile(userId, data) {
  const user = await User.findByPk(userId);

  if (!user || user.role !== "food_partner") {
    throw new Error("Food partner not found");
  }

  const updates = {};

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.phoneNumber !== undefined) updates.phoneNumber = data.phoneNumber;
  if (data.profileImage !== undefined) updates.profileImage = data.profileImage;

  if (data.openingTime !== undefined) updates.openingTime = data.openingTime;
  if (data.closingTime !== undefined) updates.closingTime = data.closingTime;

  await user.update(updates);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,

    openingTime: user.openingTime,
    closingTime: user.closingTime,

    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  fetchFoodPartnerById,
  getFoodOrdersService,
  fetchFoodPartnerProfile,
  updateFoodPartnerProfile
};
