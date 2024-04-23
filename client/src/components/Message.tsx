import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Tooltip from "./Tooltip";

type userMessageT = {
    role: "user";
    content: string;
};

type assistantMessageT = {
    role: "assistant";
    content: string;
    type: "command" | "answer";
    tooltips: { [key: string]: any };
};

export type Msg = userMessageT | assistantMessageT;

type props = {
    message: Msg;
    loading?: boolean;
};

type userMessageProps = {
    message: Msg;
};

const Message = ({ message, loading = false }: props) => {
    return message.role == "user" ? (
        <UsrMsg message={message} />
    ) : (
        <AssistantMsg message={message} loading={loading} />
    );
};

const UsrMsg = ({ message }: userMessageProps) => {
    return (
        <div className="flex gap-2">
            <Avatar>
                <AvatarImage src="./Human.webp"></AvatarImage>
            </Avatar>

            <div className="bg-yellow-200 text-left px-5 py-2 rounded-2xl rounded-tl-none max-w-screen-md">
                {message.content}
            </div>
        </div>
    );
};

const AssistantMsg = ({ message, loading = false }: props) => {
    const [content, setContent] = useState<(string | JSX.Element)[]>([]);

    useEffect(() => {
        if (message.role == "assistant") {
            const regex = /<<([^>>]*)>>/g;
            let lastIndex = 0;
            let match;
            const newContent = [];

            console.log(message.tooltips);

            while ((match = regex.exec(message.content)) !== null) {
                if (lastIndex !== match.index) {
                    newContent.push(
                        ...message.content
                            .slice(lastIndex, match.index)
                            .trim()
                            .split(" ")
                            .map((word) => <span>{word}</span>),
                    );
                }

                newContent.push(
                    <HoverCard key={newContent.length}>
                        <HoverCardTrigger className="inline">
                            <Text tooltip>{match[1]}</Text>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-fit min-w-96 max-w-prose">
                            <Tooltip
                                word={match[1]}
                                definition={message.tooltips[match[1]]}
                            />
                        </HoverCardContent>
                    </HoverCard>,
                );

                console.log(match[1], message.tooltips[match[1]]);

                lastIndex = match.index + match[0].length;
            }

            newContent.push(
                ...message.content
                    .slice(lastIndex)
                    .trim()
                    .split(" ")
                    .map((word) => <span>{word}</span>),
            );

            setContent(newContent);
        }
    }, []);

    return (
        <div className="flex flex-row-reverse gap-2">
            <Avatar>
                <AvatarImage src="./Bot.webp"></AvatarImage>
            </Avatar>

            <div className="bg-gray-200 flex text-wrap flex-wrap px-5 gap-1 py-2 rounded-2xl rounded-tr-none max-w-screen-md text-left">
                {loading ? <Loader2 className="animate-spin" /> : content}
            </div>
        </div>
    );
};

const Text = ({
    children,
    tooltip = false,
}: {
    children: string;
    tooltip?: boolean;
}) => {
    return (
        <span
            className={
                tooltip
                    ? "inline-flex text-left rounded-sm font-semibold underline cursor-pointer"
                    : "inline-flex text-left break-words"
            }
        >
            {children}
        </span>
    );
};

export default Message;
