import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jsonWebToken from 'jsonwebtoken';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @BeforeInsert()
  // mã hóa password
  async hashPasswrd(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(passwordHash: string): Promise<boolean> {
    // check password trùng khớp không
    return await bcrypt.compare(passwordHash, this.password);
  }
  toResponseObject(showToken = false) {
    const { id, created, username, token } = this;
    const responseObject = { id, created, username, token };

    if (!showToken) {
      delete responseObject.token;
    }

    return responseObject;
  }

  private get token() {
    const { id, username, created, password } = this;
    return jsonWebToken.sign(
      {
        id,
        username,
        created,
        password,
      },
      process.env.SECRET, // process.env.SECRET : mật mã để giải mã hoặc tạo token
      {
        expiresIn: '7d',
      },
    );
  }
}
