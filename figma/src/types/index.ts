export type Settings = {
  token?: string;
  user?: User;
} & Record<string, unknown>;

type BaseUser = {
  id: string | null;
  name: string;
  photoUrl: string | null;
};

interface User extends BaseUser {
  color: string;
  sessionId: number;
}

export type Image = {
  url: string;
  prompt: string;
  name: string;
  photo_url: string;
};
