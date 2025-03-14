import { User } from "@sharedTypes/user"

export const usersService = {
  async getUsers(): Promise<User[]> {
    // Mock data - gerçek API entegrasyonunda değişecek
    return [
      {
        id: 1,
        username: "john.doe",
        fullName: "John Doe",
        email: "john@example.com",
      },
      {
        id: 2,
        username: "jane.smith",
        fullName: "Jane Smith",
        email: "jane@example.com",
      },
    ]
  },
}
