export interface User {
  id: string;
  name: string;
  email: string;
  age: number,
  plan: {
    type: string;
    status: string;
    description: string;
    features: {
      conferenceCalling: boolean;
      callWaiting: boolean;
      voicemail: boolean
    }
  }
}
