import { trpc } from "../utils/trpc";

const Account = () => {
  const session = trpc.auth.getSession.useQuery();

  return <div>Hi {session?.data?.user?.name}</div>;
};

export default Account;
