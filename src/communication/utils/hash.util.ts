import * as bcrypt from 'bcrypt';

export class Hash {
  static generateHash(plainText: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(salt, plainText);
  }

  static compare(plainText: string, hash: string) {
    return bcrypt.compareSync(plainText, hash);
  }
}