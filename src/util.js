import bcrypt from 'bcrypt';

export function hashPassword(password) {
  if (!password) {
    throw new Error('Could not save password');
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function authenticatePassword(document, password) {
  return bcrypt.compareSync(password, document.password);
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
