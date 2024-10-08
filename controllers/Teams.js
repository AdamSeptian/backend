import Teams from "../models/TeamModel.js";
import path from "path";
import fs from "fs";

export const getTeams = async (req, res) => {
  try {
    const response = await Teams.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getTeamsById = async (req, res) => {
  try {
    const response = await Teams.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createTeams = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada gambar yang diunggah!" });
  const name = req.body.name;
  const description = req.body.description;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  let fileName = file.md5 + "-" + Date.now() + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({
      msg: "File yang kamu unggah tidak valid! Mohon pastikan file yang kamu unggah dalam format yang didukung seperti JPG, PNG, atau JPEG",
    });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  if(name === null || name === "") {
    return res.status(400).json({msg: "Harap menginput nama dari tim."})
  } else if (description === null || description === "") {
    return res.status(400).json({msg: "Harap menginput deskripsi dari tim."})
  }

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      let existingTeam = await Teams.findOne({ image: fileName });
      if (existingTeam) {
        const newFileName = file.md5 + "-" + Date.now() + ext;
        file.mv(`./public/images/${newFileName}`);
        fileName = newFileName;
      }
      await Teams.create({
        name: name,
        image: fileName,
        url: url,
        description: description,
      });

      res.status(201).json({ msg: "Teams Created Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  });
};

export const updateTeams = async (req, res) => {
  const teams = await Teams.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!teams) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = teams.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res
        .status(422)
        .json({
          msg: "File yang kamu unggah tidak valid! Mohon pastikan file yang kamu unggah dalam format yang didukung seperti JPG, PNG, atau JPEG",
        });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 mb" });

    const filepath = `./public/images/${teams.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const description = req.body.description;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Teams.update(
      { name: name, image: fileName, url: url, description: description },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Teams Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteTeams = async (req, res) => {
  const teams = await Teams.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!teams) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${teams.image}`;
    fs.unlinkSync(filepath);
    await Teams.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Teams Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
