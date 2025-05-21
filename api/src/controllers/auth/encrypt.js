import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = (password) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      throw new Error('Error al encriptar la contraseña');
    }
    return hash;
  });
};
