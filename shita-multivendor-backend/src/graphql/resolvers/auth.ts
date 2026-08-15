import { User } from '../../models/User';
import { hashPassword, comparePassword, generateOTP } from '../../utils/crypto';
import { generateToken } from '../../utils/jwt';
import { validateEmail, validatePassword } from '../../utils/validation';
import {
  AuthenticationError,
  ValidationError,
  ConflictError,
  NotFoundError,
} from '../../utils/errors';
import { AuthContext, requireAuth } from '../../middleware/auth';

export interface UserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
}

export const authResolvers = {
  Query: {
    profile: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);
      const user = await User.findById(context.user!.userId)
        .populate('addresses')
        .populate('favouriteRestaurants');
      if (!user) {
        throw new NotFoundError('User');
      }
      return user;
    },

    users: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);
      return await User.find({ isActive: true });
    },
  },

  Mutation: {
    createUser: async (_: any, { userInput }: { userInput: UserInput }) => {
      const { name, email, password, phone } = userInput;

      // Validate input
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email address');
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.message!);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Check if phone exists
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          throw new ConflictError('User with this phone number already exists');
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        role: 'USER',
      });

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user,
      };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      // Validate input
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email address');
      }

      if (!password) {
        throw new ValidationError('Password is required');
      }

      // Find user with password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Verify password
      if (!user.password) {
        throw new AuthenticationError('Password authentication not available for this account');
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Remove password from response
      user.password = undefined;

      return {
        token,
        user,
      };
    },

    ownerLogin: async (_: any, { email, password }: { email: string; password: string }) => {
      // Validate input
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email address');
      }

      // Find vendor or admin
      const user = await User.findOne({
        email: email.toLowerCase(),
        role: { $in: ['VENDOR', 'ADMIN'] },
      }).select('+password');

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Verify password
      if (!user.password) {
        throw new AuthenticationError('Password authentication not available');
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.password = undefined;

      return {
        token,
        user,
      };
    },

    updateUser: async (
      _: any,
      { updateUserInput }: { updateUserInput: UpdateUserInput },
      context: AuthContext
    ) => {
      requireAuth(context);

      const user = await User.findByIdAndUpdate(
        context.user!.userId,
        { $set: updateUserInput },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new NotFoundError('User');
      }

      return user;
    },

    changePassword: async (
      _: any,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.message!);
      }

      // Get user with password
      const user = await User.findById(context.user!.userId).select('+password');
      if (!user || !user.password) {
        throw new NotFoundError('User');
      }

      // Verify old password
      const isPasswordValid = await comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash and save new password
      user.password = await hashPassword(newPassword);
      await user.save();

      return {
        message: 'Password changed successfully',
      };
    },

    sendOtpToEmail: async (_: any, { email }: { email: string }) => {
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email address');
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new NotFoundError('User');
      }

      // Generate OTP
      const otp = generateOTP(6);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // TODO: Send OTP via email service
      console.log(`OTP for ${email}: ${otp}`);

      return {
        message: 'OTP sent to email successfully',
      };
    },

    sendOtpToPhoneNumber: async (_: any, { phone }: { phone: string }) => {
      const user = await User.findOne({ phone });
      if (!user) {
        throw new NotFoundError('User');
      }

      // Generate OTP
      const otp = generateOTP(6);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // TODO: Send OTP via SMS service
      console.log(`OTP for ${phone}: ${otp}`);

      return {
        message: 'OTP sent to phone successfully',
      };
    },

    verifyOtp: async (
      _: any,
      { phone, email, otp }: { phone?: string; email?: string; otp: string }
    ) => {
      let user;

      if (email) {
        user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
      } else if (phone) {
        user = await User.findOne({ phone }).select('+otp +otpExpiry');
      } else {
        throw new ValidationError('Either email or phone is required');
      }

      if (!user) {
        throw new NotFoundError('User');
      }

      if (!user.otp || !user.otpExpiry) {
        throw new ValidationError('No OTP found for this user');
      }

      if (new Date() > user.otpExpiry) {
        throw new ValidationError('OTP has expired');
      }

      if (user.otp !== otp) {
        throw new ValidationError('Invalid OTP');
      }

      // Mark as verified
      if (email) {
        user.emailVerified = true;
      } else {
        user.phoneVerified = true;
      }

      // Clear OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return {
        message: 'Verification successful',
      };
    },

    pushToken: async (_: any, { token }: { token: string }, context: AuthContext) => {
      requireAuth(context);

      await User.findByIdAndUpdate(context.user!.userId, {
        notificationToken: token,
      });

      return {
        message: 'Push token updated successfully',
      };
    },

    updateNotificationStatus: async (
      _: any,
      { isOrderNotification }: { isOrderNotification: boolean },
      context: AuthContext
    ) => {
      requireAuth(context);

      const user = await User.findByIdAndUpdate(
        context.user!.userId,
        { isOrderNotification },
        { new: true }
      );

      if (!user) {
        throw new NotFoundError('User');
      }

      return user;
    },
  },
};
