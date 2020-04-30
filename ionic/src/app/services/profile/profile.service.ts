import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ChangeEmailGQL, ChangePasswordGQL, ChangeUserImageGQL, DeleteAccountGQL, EditUserDetailsGQL } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private storage: Storage,
    private editUserDetailsGQLService: EditUserDetailsGQL,
    private changeEmailGQLService: ChangeEmailGQL,
    private changePasswordGQLService: ChangePasswordGQL,
    private changeUserImageGQLService: ChangeUserImageGQL,
    private deleteAccountGQLService: DeleteAccountGQL,
  ) { }

  async editUserDetails(firstName: string, lastName: string, description: string): Promise<boolean> {
    const result = await this.editUserDetailsGQLService.mutate({
      firstName,
      lastName,
      description
    }).toPromise();

    console.log(result);
    if (result.data.editUserDetails) {
      console.log("editUserDetails successfully.");
      return true;
    } else {
      console.log("Failed to editUserDetails.");
      return false;
    }
  }
  
  async changeEmail(newEmail: string): Promise<boolean> {
    const result = await this.changeEmailGQLService.mutate({
      newEmail
    }).toPromise();

    console.log(result);
    if ((result as any).data.changeEmail) {
      console.log("Changed email successfully");
      return true;
    } else {
      console.log("Failed to change name.");
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    const result = await this.changePasswordGQLService.mutate({
      oldPassword,
      newPassword
    }).toPromise();

    console.log(result);
    if ((result as any).data.changePassword) {
      console.log("Changed password successfully");
      return true;
    } else {
      console.log("Failed to change password.");
      return false;
    }
  }

  async changeUserImage(image: string): Promise<any> {
    const result = await this.changeUserImageGQLService.mutate({
      image
    }).toPromise();

    console.log(result);
    const response = (result as any).data.changeUserImage;
    return response;
  }

  async deleteAccount(emailAddress: string, password: string) {
    const result = await this.deleteAccountGQLService.mutate({
      emailAddress,
      password
    }).toPromise();

    console.log(result);
    if ((result as any).data.deleteAccount) {
      console.log("Deleted account successfully");
      return true;
    } else {
      console.log("Failed to delete account.");
      return false;
    }
  }

  async clearStorage() {
    await this.storage.clear();
    console.log('cleared storage');
    document.location.reload();
    // IDK Which is better? But the line above works.
    // window.location.reload();
  }
}