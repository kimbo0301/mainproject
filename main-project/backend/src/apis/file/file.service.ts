import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';

interface IFile {
    files: FileUpload[];
}

@Injectable()
export class FileService {
    async upload({ files }: IFile) {
        const storage = new Storage({
            keyFilename: 'green-chalice-347705-84e9411a5ca2.json',
            projectId: 'green-chalice-347705',
        });

        const waitedFiles = await Promise.all(files);

        const results = await Promise.all(
            waitedFiles.map((el) => {
                return new Promise((resolve, reject) => {
                    // createReadStream 파일을 읽어오는 함수
                    el.createReadStream()
                        .pipe(
                            storage
                                .bucket('codecamp-file-storage02')
                                .file(el.filename)
                                .createWriteStream(),
                        )
                        .on('finish', () =>
                            resolve(`codecamp-file-storage02/${el.filename}`),
                        ) //성공 시 이 on 함수
                        .on('error', () => reject());
                });
            }),
        );
        return results;
    }
}
