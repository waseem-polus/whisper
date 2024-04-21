import { Avatar, AvatarImage } from "./ui/avatar";

export type Msg = {
    human: boolean;
    text: any;
};

const Message = ({ human, text }: Msg) => {
    return (
        <div className={human ? "flex gap-2" : "flex flex-row-reverse gap-2"}>
            <Avatar>
                <AvatarImage
                    src={human ? "./Human.webp" : "./Bot.webp"}
                ></AvatarImage>
            </Avatar>

            <p
                className={
                    human
                        ? "bg-yellow-200 text-left px-5 py-2 rounded-2xl rounded-tl-none max-w-screen-md"
                        : "bg-gray-200 text-left px-5 py-2 rounded-2xl rounded-tr-none max-w-screen-md"
                }
            >
                {text}
            </p>
        </div>
    );
};

export default Message;
