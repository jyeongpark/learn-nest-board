import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BoardStatus } from '../board.model';

@Injectable()
export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }

    return value;
  }

  private isStatusValid(status: string) {
    const index = this.StatusOptions.indexOf(status as BoardStatus);
    return index !== -1;
  }
}
