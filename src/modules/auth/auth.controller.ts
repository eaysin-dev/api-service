import { requestMiddleware } from '@/middleware/request-middleware';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { emailService } from '../email';
import { tokenService } from '../token';
import { userService } from '../user';
import { IUserDoc } from '../user/user.interfaces';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/send-response';
import { authService } from './auth.service';
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  logoutBodySchema,
  refreshTokensBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
  resetPasswordQuerySchema,
  verifyEmailQuerySchema,
} from './auth.validation';

/**
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
const registerHandler = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.register(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  sendResponse({
    res,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: { user, tokens },
  });
});

/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
const loginHandler = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: { user, tokens },
  });
});

/**
 * @desc Logout a user
 * @route POST /auth/logout
 * @access Private
 */
const logoutHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Logged out successfully',
  });
});

/**
 * @desc Refresh authentication tokens
 * @route POST /auth/refresh-tokens
 * @access Public
 */
const refreshTokensHandler = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Tokens refreshed successfully',
    data: userWithTokens,
  });
});

/**
 * @desc Request password reset link
 * @route POST /auth/forgot-password
 * @access Public
 */
const forgotPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Password reset email sent successfully',
  });
});

/**
 * @desc Reset password
 * @route POST /auth/reset-password
 * @access Public
 */
const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'] as string, req.body.password);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Password reset successful',
  });
});

/**
 * @desc Send email verification link
 * @route POST /auth/send-verification-email
 * @access Private
 */
const sendVerificationEmailHandler = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Verification email sent successfully',
  });
});

/**
 * @desc Verify user email
 * @route POST /auth/verify-email
 * @access Public
 */
const verifyEmailHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token'] as string);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'Email verified successfully',
  });
});

/**
 * @desc Get current user's information
 * @route GET /auth/me
 * @access Private
 */
const meHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDoc;

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: user,
  });
});

// Middleware-wrapped controller methods with validation
export const register = requestMiddleware(registerHandler, { validation: { body: registerBodySchema } });
export const login = requestMiddleware(loginHandler, { validation: { body: loginBodySchema } });
export const logout = requestMiddleware(logoutHandler, { validation: { body: logoutBodySchema } });
export const refreshTokens = requestMiddleware(refreshTokensHandler, {
  validation: { body: refreshTokensBodySchema },
});
export const forgotPassword = requestMiddleware(forgotPasswordHandler, {
  validation: { body: forgotPasswordBodySchema },
});
export const resetPassword = requestMiddleware(resetPasswordHandler, {
  validation: { body: resetPasswordBodySchema, query: resetPasswordQuerySchema },
});
export const sendVerificationEmail = requestMiddleware(sendVerificationEmailHandler);
export const verifyEmail = requestMiddleware(verifyEmailHandler, {
  validation: { query: verifyEmailQuerySchema },
});
export const me = requestMiddleware(meHandler);
