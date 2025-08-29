import { ApiClient } from '@/providers';
import type { ILogin, IUser } from '@/types/auth.ts';


const endpoint = '/user';

export default {
  login: (body: { email: string, password: string }) => {
    return ApiClient.post<ILogin>(`${endpoint}/login`, body);
  },
  register: (body: Partial<IUser>) => {
    return ApiClient.post<Partial<IUser>>(`${endpoint}/register`, body)
  }
};
