import { Avatar as PaperAvatar } from "react-native-paper";

type Props = {
  url: string | null;
  text: string;
  size?: number;
};

export function Avatar({ url, text, size = 40 }: Props) {
  if (url) {
    return <PaperAvatar.Image source={{ uri: url }} size={size} />;
  }

  return <PaperAvatar.Text label={text} size={size} />;
}
