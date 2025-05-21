import bcrypt from 'bcrypt';
import UserSchema from '../../models/user.cjs';

export const verifyUserCredentials = async (req, res) => {
  const { name, password } = req.body;
  try {
    if (!name || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const findUser = await UserSchema.findOne({ name });

    if (!findUser) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error al comparar las contraseñas' });
      }
      if (result) {
        res.status(200).json({
          user: findUser,
          success: 'Usuario verificado',
        });
      } else {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
