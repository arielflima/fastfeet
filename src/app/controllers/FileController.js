import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async index(req, res) {
    const list = await File.findAll();

    res.json(list);
  }
}

export default new FileController();
