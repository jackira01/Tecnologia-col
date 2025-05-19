import UserSchema from '../../models/user.cjs';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export const postUser = async (req, res) => {
  const data = req.body;
  try {
    const userExist = await UserSchema.findOne({
      name: data.name,
    });

    if (userExist) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    if (!data.name || !data.password || !data.role) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    if (data.password.length < 6) {
      return res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    bcrypt.hash(data.password, saltRounds, async (err, hash) => {
      if (err) {
        throw new Error('Error al encriptar la contraseña');
      }
      const newData = {
        ...data,
        password: hash,
      };

      const createUser = await UserSchema.create(newData);

      res.status(201).json({ user: createUser, message: 'Creado con exito' });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
