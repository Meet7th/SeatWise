import bcrypt from 'bcryptjs';
import { prisma } from '@/config/database';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import type { RegisterRequest, LoginRequest, AuthTokens } from '@seatwise/shared';

const SALT_ROUNDS = 10;

function validatePassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

export async function register(req: RegisterRequest) {
  if (!req.phone && !req.email) {
    throw Object.assign(new Error('请输入手机号或邮箱'), { code: 40001 });
  }
  if (req.phone && !validatePhone(req.phone)) {
    throw Object.assign(new Error('手机号格式不正确'), { code: 40002 });
  }
  if (!validatePassword(req.password)) {
    throw Object.assign(new Error('密码需8位以上，包含大小写字母和数字'), { code: 40004 });
  }

  // 查找邀请码对应的班级
  const classroom = await prisma.classroom.findFirst({
    where: { inviteCode: req.inviteCode.toUpperCase() },
  });
  if (!classroom) {
    throw Object.assign(new Error('邀请码无效或已过期'), { code: 40001 });
  }

  // 检查手机号是否已注册
  if (req.phone) {
    const existing = await prisma.user.findUnique({ where: { phone: req.phone } });
    if (existing) {
      throw Object.assign(new Error('手机号已被注册'), { code: 40002 });
    }
  }

  // 检查邮箱是否已注册
  if (req.email) {
    const existing = await prisma.user.findUnique({ where: { email: req.email } });
    if (existing) {
      throw Object.assign(new Error('邮箱已被注册'), { code: 40002 });
    }
  }

  const passwordHash = await bcrypt.hash(req.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: req.name,
      phone: req.phone || null,
      email: req.email || null,
      passwordHash,
      studentNumber: req.studentNumber || null,
      role: 'student',
      classMemberships: {
        create: { classId: classroom.id },
      },
    },
  });

  const tokens = generateTokens(user.id, user.role);

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      studentNumber: user.studentNumber,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      wechatOpenId: null,
      qqOpenId: null,
      schoolId: null,
    },
    tokens,
  };
}

export async function login(req: LoginRequest) {
  if (!req.phone && !req.email) {
    throw Object.assign(new Error('请输入手机号或邮箱'), { code: 40001 });
  }

  const user = await prisma.user.findFirst({
    where: req.phone ? { phone: req.phone } : { email: req.email! },
  });

  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('账号或密码错误'), { code: 40100 });
  }

  const valid = await bcrypt.compare(req.password, user.passwordHash);
  if (!valid) {
    throw Object.assign(new Error('账号或密码错误'), { code: 40100 });
  }

  if (user.status !== 'active') {
    throw Object.assign(new Error('账号已被禁用'), { code: 40101 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = generateTokens(user.id, user.role);

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      studentNumber: user.studentNumber,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: new Date().toISOString(),
      wechatOpenId: null,
      qqOpenId: null,
      schoolId: null,
    },
    tokens,
  };
}

function generateTokens(userId: string, role: string): AuthTokens {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId, role),
  };
}
