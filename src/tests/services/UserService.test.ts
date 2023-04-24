import { BaseAuthUser, BaseUser, User } from "../../interfaces/IUser";
import { UserService } from "../../services/UserService";

const userService = new UserService();

describe("testing for userService", () => {
  const user: BaseAuthUser = {
    username: "ducanhnguyen",
    firstname: "Duc Anh",
    lastname: "Nguyen",
    password: "12345678",
  };

  async function createUser(userParams: BaseAuthUser) {
    return userService.create(userParams);
  }

  async function deleteUser(id: number) {
    return userService.delete(id);
  }

  it("testing for create a user", async () => {
    const createdUser: User = await createUser(user);

    if (createdUser) {
      const { username, firstname, lastname } = createdUser;

      expect(username).toBe(user.username);
      expect(firstname).toBe(user.firstname);
      expect(lastname).toBe(user.lastname);
    }

    await deleteUser(createdUser.id);
  });

  it("testing for create, detail, delete a user", async () => {
    const createdUser: User = await createUser(user);
    const userFromDb = await userService.getDetail(createdUser.id);

    expect(userFromDb).toEqual(createdUser);

    await deleteUser(createdUser.id);
  });

  it("testing for create, update a user", async () => {
    const createdUser: User = await createUser(user);
    const newUserData: BaseUser = {
      firstname: "Duc Anh 2",
      lastname: "Nguyen",
    };

    const { firstname, lastname } = await userService.update(
      createdUser.id,
      newUserData
    );

    expect(firstname).toEqual(newUserData.firstname);
    expect(lastname).toEqual(newUserData.lastname);

    await deleteUser(createdUser.id);
  });
});
