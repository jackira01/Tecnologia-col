import UserSchema from '../../models/user.cjs';

export const verifyGoogleUser = async (req, res) => {
  const { user_name, id } = req.body;
  try {
    let findUser = await UserSchema.findOne({ user_name });
    if (!findUser) {
      const newUser = await UserSchema.create({
        user_name,
        user_id: id,
        role: 'client', // o lo que quieras por defecto
      });
      findUser = newUser;
    }

    return res.status(200).json(findUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
