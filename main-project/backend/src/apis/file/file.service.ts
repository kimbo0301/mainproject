import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { config } from 'dotenv';
import { env } from 'process';
config();
// 스토리지 서비스에서 url을 받아옴

interface IFile {
    files: FileUpload[]; //객체 파일의 타입을 지정해주기 위헤
}

@Injectable()
export class FileService {
    async upload({ files }: IFile) {
        // 구글 클라우드 플랫폼에서 스토리지 라이브러리가 있음
        // @google-cloud/storage
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(`mainproject_boin`);

        console.log(storage);
        // 일단 먼저 파일을 다 받기
        const waitedFiles = await Promise.all(files);
        console.log(waitedFiles);
        const results = await Promise.all(
            waitedFiles.map((el) => {
                return new Promise((resolve, reject) => {
                    // createReadStream 파일을 읽어오는 함수
                    el.createReadStream()
                        .pipe(storage.file(el.filename).createWriteStream())
                        .on('finish', () =>
                            resolve(`mainproject_boin/${el.filename}`),
                        ) //성공 시 이 on 함수
                        .on('error', () => reject());
                });
            }),
        );
        return results;
    }
}

// 버킷에 받아온 파일의 이름으로 스토리지에 저장

// const result = await new Promise((resolve, reject) => {
//   // createReadStream 파일을 읽어오는 함수
//   file
//     .createReadStream()
//     .pipe(
//       storage
//         .bucket('codecamp-file-storage02')
//         .file(file.filename)
//         .createWriteStream(),
//     ) // createWriteStream 스토리지에 읽어들인 파일을 업로드 write
//     .on('finish', () => resolve(`codecamp-file-storage02/${file.filename}`)) //성공 시 이 on 함수
//     .on('error', () => reject()); //실패 시 이 on 함수
// });
// //pipe 2차적인 작업을 할 때 사용하는 함수
// //읽은 파일의 업로드 또는 읽은 파일의 사이즈,화질 변경 등
// return result;
