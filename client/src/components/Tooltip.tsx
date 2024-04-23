import { BookA, BotMessageSquare, Speaker, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { speak } from "./VoiceRecognition";
import { useState } from "react";

type props = {
    word: string;
    definition: string;
};

const Tooltip = ({ word, definition }: props) => {
    const [isTalking, setIsTalking] = useState<boolean>(false);
    return (
        <div className="flex gap-4 place-items-center">
            <div className="flex justify-end">
                {isTalking ? (
                    <Button variant="outline" size="icon" disabled>
                        <BotMessageSquare />
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            speak(definition, setIsTalking);
                        }}
                    >
                        <Volume2 />
                    </Button>
                )}
            </div>
            {/* <div className="min-w-8 grid place-items-center">
                <BookA size={32} strokeWidth={1.4} />
            </div> */}
            <div className="flex flex-col justify-start text-left">
                <h1 className="text-md font-semibold">{word}</h1>
                <p className="text-sm font-light">{definition}</p>
            </div>
        </div>
    );
};

export default Tooltip;
