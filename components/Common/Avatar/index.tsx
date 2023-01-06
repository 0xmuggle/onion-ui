import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

interface Props {
  className?: string;
  avatar: any;
  size?: number;
}
const Avatar = ({ avatar, size = 36, className = "" }: Props) => (
  <div className={`avatar ${className}`}>
    <div className="rounded-full">
      <img
        alt="avatar"
        src={createAvatar(style, {
          seed: avatar,
          base64: true,
          size,
        })}
      />
    </div>
  </div>
);

export default Avatar;
