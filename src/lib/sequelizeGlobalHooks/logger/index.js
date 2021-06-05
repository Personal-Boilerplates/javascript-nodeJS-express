import LoggerSchema from "./LoggerSchema";
import { model } from "mongoose";

export default async function Logger(tabbleName, cod, usuario, colunas) {
  const loggerModel = model(tabbleName, LoggerSchema, tabbleName);

  let logIndex = await loggerModel.findById(cod);

  if (!logIndex) {
    return loggerModel.create({
      _id: cod,
      alteracao: [
        {
          usuario: usuario,
          colunas: colunas,
        },
      ],
    });
  }

  const novoLog = await logIndex.alteracao.create({
    usuario,
    colunas,
  });

  return logIndex.updateOne({ alteracao: [novoLog, ...logIndex.alteracao] });
}
