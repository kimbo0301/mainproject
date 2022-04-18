import {
    ConflictException,
    HttpException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
import { CannotAttachTreeChildrenEntityError } from 'typeorm';

config();
@Injectable({})
export class IamPortService {
    async getToken() {
        try {
            const result = await axios.post(
                'https://api.iamport.kr/users/getToken',
                {
                    imp_key: process.env.IAMPORT_API_KEY, // REST API 키
                    imp_secret: process.env.IAMPORT_SECRET, // REST API Secret
                },
            );
            return result.data.response.access_token;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
            // console.log(error); 아이엠포트에서 제공해주는 에러 try catch로 에러를 잡을 수 있음
        }
    }

    async checkPaid({ impUid, token, amount }) {
        console.log('Asdf');
        try {
            const result = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                { headers: { Authorization: token } },
            );

            if (result.data.response.status !== 'paid')
                throw new ConflictException('결제 내역이 존재하지 않습니다.');
            if (result.data.response.amount !== amount)
                throw new UnprocessableEntityException(
                    '결제 금액이 잘못되었습니다.',
                );
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.message) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error; // 위에 throw new 로 써준 애들이 이리로 들어옴
            }
        }
    }

    async cancel({ impUid, token }) {
        try {
            const result = await axios.post(
                `https://api.iamport.kr/payments/cancel`, // 주소
                { imp_uid: impUid }, //Uid
                { headers: { Authorization: token } }, // token
            );
            return result.data.response.cancel_amount;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
        }
    }
}
