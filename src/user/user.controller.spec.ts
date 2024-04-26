import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupCommand, LoginCommand, CheckTokenCommand } from './user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signup: jest.fn(),
            confirmEmail: jest.fn(),
            login: jest.fn(),
            checkToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call userService.signup with correct command', async () => {
      const command: SignupCommand = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@example.com',
        password: 'test123',
      };
      await controller.signup(command);
      expect(userService.signup).toHaveBeenCalledWith(command);
    });
  });

  
});
