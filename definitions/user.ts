import Group from "@/definitions/group";

type User = {
    googleId: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    creationTime: Date;
    lastLogin: Date;
    groups: Group[];
}

export default User;
