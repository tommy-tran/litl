import mongoose, { Schema } from 'mongoose';
import generator from 'generate-password';

const passwordSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 50
  },
  dateCreated: {
    type: String
  }
});

passwordSchema.statics = {
  generatePassword(options) {
    return generator.generate({
      length: options.length || 10,
      numbers: options.numbers,
      symbols: options.symbols,
      uppercase: options.uppercase,
      excludeSimilarCharacters: options.excludeSimilarCharacters,
      exclude: options.exclude
    });
  }
};

export default mongoose.model('Password', passwordSchema);
