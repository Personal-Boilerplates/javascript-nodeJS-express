import { Schema } from "mongoose";

const alteracao = new Schema(
  {
    usuario: {
      type: Number,
      required: true
    },
    colunas: {
      type: [],
      required: true
    },
    dia: {
      type: String,
      default: () => new Date().toDateString()
    },
    hora: {
      type: String,
      default: () => new Date().toTimeString()
    }
  },
  {
    _id: false
  }
);

const LoggerSchema = new Schema(
  {
    _id: {
      type: Number,
      alias: "cod"
    },
    alteracao: [alteracao]
  },
  {
    versionKey: false
  }
);

export default LoggerSchema;
