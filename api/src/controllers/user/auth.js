import bcrypt from 'bcrypt';
import UserSchema from '../../models/user.cjs';

export const verifyUser = async (req, res) => {
  const { user, password } = req.body;
  try {
    if (!user || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }
    const findUser = await UserSchema.findOne({ name: user });

    if (!findUser) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al comparar las contraseñas' });
      }
      if (result) {
        res.status(200).json({
          user: findUser,
          status: true,
          message: 'Usuario verificado',
        });
      } else {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
