import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: [
        "uuid",
        "username",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getUsersById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: [
        "uuid",
        "username",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createUsers = async (req, res) => {
  const { username, email, password, confPassword, role } = req.body;
  const existingUser = await Users.findOne({
    where: {
      username: username,
    },
  });
  const existingEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return res.status(400).json({ msg: "Username sudah terdaftar!" });
  }
  if (existingEmail) {
    return res.status(400).json({ msg: "Email sudah terdaftar!" });
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok!" });
  const hashPassword = await argon2.hash(password);
  if (password.length < 8) {
    return res.status(400).json({ msg: "Password harus minimal 8 karakter!" });
  }
  try {
    await Users.create({
      username: username,
      email,
      email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Register berhasil!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status().json({ msg: "User tidak ditemukan" });

  const { username, email, password, confPassword, role } = req.body;

  if (!password) {
    return res.status(400).json({ msg: "Password tidak boleh kosong" });
  }

  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });
  try {
    await Users.update(
      {
        username: username,
        email,
        email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status().json({ msg: "User tidak ditemukan" });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
