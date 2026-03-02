import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

type LoginResult = { accessToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid: boolean = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user: User = await this.validateUser(email, password);

    const payload: { sub: string; email: string } = {
      sub: user.id,
      email: user.email,
    };

    // Using signAsync tends to satisfy stricter lint/type setups better
    const accessToken: string = await this.jwt.signAsync(payload);

    return { accessToken };
  }
}
