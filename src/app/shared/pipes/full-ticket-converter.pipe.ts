import { Optional, Pipe, PipeTransform } from '@angular/core';
import { FullTicket, Ticket } from '../models/ticket';
import { LoggerService } from '../services/logger.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Pipe({
  name: 'fullTicketConverter',
})
export class FullTicketConverterPipe implements PipeTransform {
  constructor(
    private userService: UserService,
    @Optional() private logger: LoggerService,
  ) {}

  async transform<T extends boolean>(
    value: T extends true ? FullTicket : Ticket,
    backward: T = false as T,
  ): Promise<T extends true ? Ticket : FullTicket> {
    if (backward) {
      return {
        ...value,
        assignee: (value.assignee as User).id,
        reporter: (value.reporter as User).id,
      } as T extends true ? Ticket : FullTicket;
    }
    const users = await Promise.all(
      [value.assignee, value.reporter].map((userId) =>
        this.userService.getUserByIdPromise(userId as string),
      ),
    );

    return {
      ...value,
      assignee: users[0],
      reporter: users[1],
    } as T extends true ? Ticket : FullTicket;
  }
}
