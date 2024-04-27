import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'userConverter',
})
export class UserConverterPipe implements PipeTransform {
  constructor(private userSerivce: UserService) {}

  async transform<T extends string | string[]>(
    value: T,
  ): Promise<T extends string ? User : User[]> {
    if (typeof value === 'string') {
      return (await this.userSerivce.getUserByIdPromise(
        value,
      )) as T extends string ? User : User[];
    } else {
      return (await Promise.all(
        value.map(
          async (id) => (await this.userSerivce.getUserByIdPromise(id)) as User,
        ),
      )) as T extends string ? User : User[];
    }
  }
}
