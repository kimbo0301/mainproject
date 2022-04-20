const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

exports.generateThumbnail = async (event, context) => {
  // 1. event, context 데이터로그 확인하기
  console.log("hello world!!!");
  console.log("====================");
  console.log("context: ", context);
  console.log("evnt: ", event);
  console.log("====================");

  if (event.name.includes("thumb/")) return;

  const storage = new Storage().bucket(event.bucket);
  const prefix = event.name.split("/origin/")[0];
  const postfix = event.name.split("/origin/")[1];

  await Promise.all(
    [
      { size: 320, fname: `${prefix}/thumb/s/${postfix}` },
      { size: 640, fname: `${prefix}/thumb/m/${postfix}` },
      { size: 1280, fname: `${prefix}/thumb/l/${postfix}` },
    ].map((el) => {
      new Promise((resolve, reject) => {
        storage
          .file(event.name)
          .createReadStream()
          .pipe(sharp().resize({ width: el.size }))
          .pipe(storage.file(`${el.fname}`).createWriteStream())
          .on("finish", () => resolve())
          .on("error", () => reject());
      });
    })
  );
};
