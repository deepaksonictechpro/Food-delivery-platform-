const { User, Food } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

//------------------------------- CREATE ADMIN (ONE TIME ONLY)--------------------------------------

async function createAdminService({ fullName, email, password }) {
  if (!fullName || !email || !password) {
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingAdmin = await User.findOne({
    where: { email: normalizedEmail, role: "admin" },
  });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    role: "admin",
  });

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
    token,
  };
}



//--------------------------------------- Get all users ---------------------------------------------

async function fetchAllUsers({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC" }) {
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ["password"] },
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    users: rows,
  };
}

//--------------------------------------- Get all foods ---------------------------------------------

async function fetchAllFoods({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC" }) {
  const offset = (page - 1) * limit;

  const { count, rows } = await Food.findAndCountAll({
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    foods: rows,
  };
}


//--------------------------------------- Get all food partner---------------------------------------

async function fetchAllFoodPartners({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC" }) {
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: { role: "food_partner" },
    attributes: { exclude: ["password"] },
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    partners: rows,
  };
}


//--------------------------------------- Get all delivery partners ----------------------------------

async function fetchAllDeliveryPartners({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC" }) {
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: { role: "delivery_partner" },
    attributes: { exclude: ["password"] },
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    partners: rows,
  };
}

//--------------------------------------- Get admin profile --------------------------------------------

async function fetchAdminProfile(adminId) {
  const admin = await User.findOne({
    where: { id: adminId, role: "admin" },
    attributes: ["id", "fullName", "email", "role", "profileImage", "status"]
  });

  if (!admin) throw new Error("Admin not found");
  return admin;
}

//--------------------------------------- Update admin profile ------------------------------------------

async function updateAdminProfile(adminId, data) {
  const admin = await User.findOne({ where: { id: adminId, role: "admin" } });
  if (!admin) throw new Error("Admin not found");

  await admin.update({
    fullName: data.fullName || admin.fullName,
    email: data.email || admin.email,
    profileImage: data.profileImage || admin.profileImage,
    status: data.status || admin.status
  });

  return {
    id: admin.id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
    profileImage: admin.profileImage,
    status: admin.status
  };
}


module.exports = {
  fetchAllUsers,
  fetchAllFoods,
  fetchAllFoodPartners,
  fetchAllDeliveryPartners,
  fetchAdminProfile,
  updateAdminProfile,
  createAdminService,
};