import { Board } from 'src/apis/board/entities/board.entity';
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BoardImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    src: string;

    @ManyToOne(() => Board)
    board: Board;
}
