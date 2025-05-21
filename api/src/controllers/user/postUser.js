import bcrypt from 'bcrypt';
import UserSchema from '../../models/user.cjs';
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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  // Opción para devolver el documento actualizado
  const options = { new: true };
  try {
    const updateProduct = await UserSchema.findByIdAndUpdate(id, data, options);
    res
      .status(201)
      .json({ product: updateProduct, message: 'Actualizado con exito' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
