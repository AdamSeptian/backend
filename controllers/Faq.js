import Faq from "../models/FaqModel.js";

export const getFaq = async (req, res) => {
  try {
    let response;
      response = await Faq.findAll({
        attributes: ['uuid', 'judul', 'deskripsi', 'createdAt', 'updatedAt'],
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const getFaqById = async (req, res) => {
    try {
        const response = await Faq.findOne({
            attributes: ['uuid', 'judul', 'deskripsi', 'createdAt', 'updatedAt'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createFaq = async (req, res) => {
  const { judul, deskripsi } = req.body;
  try {
    await Faq.create({
        judul: judul,
        deskripsi: deskripsi,
    });
    res.status(201).json({ msg: "Sukses membuat data" });
  } catch (error) {
    if (judul === "") {
      res.status(500).json({
        msg: 'Judul tidak boleh kosong!'
      });
    } else if (deskripsi === "") {
      res.status(500).json({
        msg: 'Deskripsi tidak boleh kosong!'
      });
    } else {
      res.status(500).json({
        msg: error.message
      });
    }    
  }
}

export const updateFaq = async (req, res) => {
    try {
    const faq = await Faq.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!faq) return res.status(404).json({ msg: "data tidak ditemukan " });
    const { judul, deskripsi } = req.body;
    if (req.role === "admin") {
      await Faq.update(
        { judul, deskripsi },
        {
          where: {
            id: faq.id,
          },
        }
      );
    } else {
      if (req.userId !== faq.userId)
        return res.status(403).json({ msg: "akses terlarang!" });
      await Faq.update(
        { judul, deskripsi },
        {
          where: {
            [Op.and]: [{ id: faq.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


export const deleteFaq = async (req, res) => {
    try {
        const faq = await Faq.findOne({
          where: {
            uuid: req.params.id,
          },
        });
        if (!faq) return res.status(404).json({ msg: "data tidak ditemukan " });
        if (req.role === "admin") {
          await Faq.destroy({
            where: {
              id: faq.id,
            },
          });
        } else {
          if (req.userId !== faq.userId)
            return res.status(403).json({ msg: "akses terlarang!" });
          await Faq.destroy({
            where: {
              [Op.and]: [{ id: faq.id }, { userId: req.userId }],
            },
          });
        }
        res.status(200).json({ msg: "Data berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
}
