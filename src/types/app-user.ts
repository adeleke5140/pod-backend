export interface IBaseAppUser {
  id: string;

  email: string;
  firstName: string;
  lastName: string;

  phoneNumber?: string;
  phoneNumberCode?: string;

  profileImage?: string;
  metadata?: {
    [key: string]: unknown;
    loggedInAsDetail?: {
      requesterEmail: string;
      requesterId: string;
    };
  };

  isActive: boolean;
  isEmailVerified: boolean;

  updatedAt: string;
  createdAt: string;
}
