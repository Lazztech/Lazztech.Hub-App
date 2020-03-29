import { UseGuards, Logger } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { User } from '../dal/entity/user.entity';
import { FileService } from 'src/services/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver()
export class AccountResolver {
  private logger = new Logger(AccountResolver.name, true);

  constructor(
    private fileService: FileService,
    @InjectRepository(User)
    private userRepository: Repository<User>
    ) {
    this.logger.log('constructor');
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async editUserDetails(
    @UserId() userId,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({ name: 'lastName', type: () => String }) lastName: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<User> {
    this.logger.log(this.editUserDetails.name);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.firstName = firstName;
    user.lastName = lastName;
    user.description = description;
    await this.userRepository.save(user);

    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeEmail(
    @UserId() userId,
    @Args({ name: 'newEmail', type: () => String }) newEmail: string,
  ): Promise<User> {
    this.logger.log(this.changeEmail.name);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.email = newEmail;
    await this.userRepository.save(user);

    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async changePassword(
    @UserId() userId,
    @Args({ name: 'oldPassword', type: () => String }) oldPassword: string,
    @Args({ name: 'newPassword', type: () => String }) newPassword: string,
  ): Promise<boolean> {
    this.logger.log(this.changePassword.name);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(oldPassword, user.password);

    if (valid) {
      const newHashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = newHashedPassword;
      await this.userRepository.save(user);

      return true;
    } else {
      return false;
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeUserImage(
    @UserId() userId,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<User> {
    this.logger.log(this.changeUserImage.name);

    let user = await this.userRepository.findOne(userId);

    if (user.image) {
      await this.fileService.deletePublicImageFromUrl(user.image);
    }
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      newImage,
    );

    user.image = imageUrl;
    user = await this.userRepository.save(user);
    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAccount(
    @UserId() userId,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<boolean> {
    this.logger.log(this.deleteAccount.name);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(password, user.password);

    if (valid && email === user.email) {
      await this.userRepository.remove(user);
      return true;
    } else {
      return false;
    }
  }
}
