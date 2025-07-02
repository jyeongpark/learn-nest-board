// 로직 처리부분
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board-dto';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`can't find board with id ${id}`);
    }

    return found;
  }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`can't find board with id ${id}`);
    }
  }

  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.id = :id', { id });
    query.andWhere('board.userId = :userId', { userId: user.id });

    const board = await query.getOne();

    if (!board) {
      throw new NotFoundException(`can't update board with id ${id}`);
    }

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
