const fs = require("fs"),
  sharp = require("sharp");
const { default: controllerHandleError } = require("../controllers/custom/controllerHandleError");

exports.compressImage = async (file, size, res) => {
  if (file) {
    if (file.path.split(".")[1] !== "webp") {
      const newPath = file.path.split(".")[0] + ".webp";

      return sharp(file.path)
        .resize(size)
        .toFormat("webp")
        .webp({
          quality: 100,
        })
        .toBuffer()
        .then((data) => {
          fs.access(file.path, (err) => {
            if (!err) {
              fs.unlink(file.path, (err) => {
                if (err) {
                  return res
                    .status(404)
                    .json(
                      controllerHandleError(
                        "Erro ao comprimir arquivo, tente subir um arquivo com o tamanho menor."
                      )
                    );
                }
              });
            }
          });

          //Agora vamos armazenar esse buffer no novo caminho
          fs.writeFile(newPath, data, (err) => {
            if (err) {
              console.log(err);
              // Já aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
              throw err;
            }
          });

          // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
          return newPath;
        });
    } else {
      return file.path;
    }
  } else {
    return "";
  }
};
