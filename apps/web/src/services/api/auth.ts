import { ApiClient } from '@/providers';

interface Login {
  message: string
  data: {
    user: {
      email: string,
      username: string
    },
    token: string
  }
}

const endpoint = '/user';

export default {
  login: (body: { email: string, password: string }) => {
    return ApiClient.post<Login>(`${endpoint}/login`, body);
  },
};
