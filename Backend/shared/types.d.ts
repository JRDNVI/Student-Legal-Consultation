export type ConfirmSignUpBody = {
    username: string;
    role: string;
    code: string;
  }
  
  export type SignInBody = {
    username: string;
    password: string;
  }
  
  export type SignUpBody = {
    username: string;
    password: string;
    role: string;
    email: string
  }