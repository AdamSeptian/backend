import Catatan from "../models/CatatanModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getCatatan = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Catatan.findAll({
        attributes: [
          "uuid",
          "kategori",
          "keterangan",
          "jumlah",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    } else {
      response = await Catatan.findAll({
        attributes: [
          "uuid",
          "kategori",
          "keterangan",
          "jumlah",
          "createdAt",
          "updatedAt",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getCatatanById = async (req, res) => {
  try {
    const catatan = await Catatan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!catatan) return res.status(404).json({ msg: "data tidak ditemukan " });
    let response;
    if (req.role === "admin") {
      response = await Catatan.findOne({
        attributes: [
          "uuid",
          "kategori",
          "keterangan",
          "jumlah",
          "createdAt",
          "updatedAt",
        ],
        where: {
          id: catatan.id,
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    } else {
      response = await Catatan.findOne({
        attributes: [
          "uuid",
          "kategori",
          "keterangan",
          "jumlah",
          "createdAt",
          "updatedAt",
        ],
        where: {
          [Op.and]: [{ id: catatan.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["username", "email", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createCatatan = async (req, res) => {
  const { kategori, keterangan, jumlah } = req.body;
  try {
    await Catatan.create({
      kategori: kategori,
      keterangan: keterangan,
      jumlah: jumlah,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Berhasil membuat catatan baru!" });
  } catch (error) {
    if (kategori === "") {
      res.status(500).json({
        msg: "Kategori tidak valid atau kosong. Harap masukkan kategori yang valid untuk melanjutkan proses!",
      });
    } else if (keterangan === "") {
      res.status(500).json({
        msg: "Keterangan tidak dapat dikosongkan. Harap masukkan informasi keterangan yang relevan untuk melanjutkan proses!",
      });
    } else if (jumlah === "" || jumlah === null) {
      res.status(500).json({
        msg: "Jumlah uang tidak valid atau kosong. Mohon pastikan untuk memasukkan jumlah uang yang benar untuk melanjutkan proses!",
      });
    } else {
      res.status(500).json({ msg: error.message });
    }
  }
};
export const updateCatatan = async (req, res) => {
  try {
    const catatan = await Catatan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!catatan) return res.status(404).json({ msg: "data tidak ditemukan " });
    const { kategori, keterangan, jumlah } = req.body;
    if (req.role === "admin") {
      await Catatan.update(
        { kategori, keterangan, jumlah },
        {
          where: {
            id: catatan.id,
          },
        }
      );
    } else {
      if (req.userId !== catatan.userId)
        return res.status(403).json({ msg: "akses terlarang!" });
      await Catatan.update(
        { kategori, keterangan, jumlah },
        {
          where: {
            [Op.and]: [{ id: catatan.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "catatan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteCatatan = async (req, res) => {
  try {
    const catatan = await Catatan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!catatan) return res.status(404).json({ msg: "data tidak ditemukan " });
    // const { kategori, keterangan, jumlah } = req.body;
    if (req.role === "admin") {
      await Catatan.destroy({
        where: {
          id: catatan.id,
        },
      });
    } else {
      if (req.userId !== catatan.userId)
        return res.status(403).json({ msg: "akses terlarang!" });
      await Catatan.destroy({
        where: {
          [Op.and]: [{ id: catatan.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "catatan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
