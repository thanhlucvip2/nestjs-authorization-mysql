import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async showAllUser() {
    const user = await this.userRepository.find();
    return user.map((use) => use.toResponseObject(true));
  }

  async login(data: UserDto) {
    const { username, password } = data;
    if (!username || !password) {
      throw new HttpException(
        'Vui lòng điền đủ username password!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check xem user có tồn tại trong database chưa
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'username/password không đúng',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject(true);
  }

  async register(data: UserDto) {
    const { username, password } = data;
    if (!username || !password) {
      throw new HttpException(
        'Vui lòng điền đủ username password!',
        HttpStatus.BAD_REQUEST,
      );
    }
    let user = await this.userRepository.findOne({ where: { username } });
    // check user đã tồn tại chưa
    if (user) {
      throw new HttpException(
        'User đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(data);
    console.log(user);
    user.toResponseObject(true);
    await this.userRepository.save(user);
    return user.toResponseObject(true);
  }
}
