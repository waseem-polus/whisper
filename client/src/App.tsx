import { useEffect, useState } from "react";
import "./App.css";
import { useVoiceRecognition, speak } from "./components/VoiceRecognition";
import { Button } from "./components/ui/button";
import Message, { Msg } from "./components/Message";
import fetchChatGPTResponse from "./components/KnoledgeModel";
import {
    BookA,
    BookAudio,
    BookHeadphones,
    BookMarked,
    BookText,
    BookType,
    BookUser,
    BotMessageSquare,
    Ear,
    EarOff,
    Mic,
} from "lucide-react";
import { useToast } from "./components/ui/use-toast";

function App() {
    const [chatLog, setChatLog] = useState<Array<Msg>>([]);
    const { listen, transcript, isListening, clearTranscript } =
        useVoiceRecognition();
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isTalking, setIsTalking] = useState<boolean>(false);
    const [autoListen, setAutoListen] = useState<boolean>(true);

    const { toast } = useToast();

    useEffect(() => {
        if (!isListening && transcript != "") {
            setChatLog([...chatLog, { role: "user", content: transcript }]);

            setIsThinking(true);
            fetchChatGPTResponse(transcript).then((res) => {
                setIsThinking(false);
                setChatLog([
                    ...chatLog,
                    { role: "user", content: transcript },
                    {
                        role: "assistant",
                        ...res,
                    },
                ]);

                if (res.type === "answer") {
                    speak(
                        res.content,
                        setIsTalking,
                        autoListen ? listen : () => {},
                    );
                } else if (res.type === "command" && res.content === "repeat") {
                    speak(
                        chatLog[chatLog.length - 1].content,
                        setIsTalking,
                        autoListen ? listen : () => {},
                    );
                } else if (res.type === "command" && res.content === "quit") {
                    setChatLog([
                        {
                            role: "assistant",
                            type: "answer",
                            content:
                                "Started a new context. How can I help you?",
                            tooltips: {},
                        },
                    ]);
                    speak(
                        "Started a new context. How can I help you?",
                        setIsTalking,
                        autoListen ? listen : () => {},
                    );
                }
            });
            clearTranscript();
        }
    }, [isListening]);

    return (
        <div className="w-screen h-screen flex flex-col pb-4 justify-end bg-gradient-to-tl from-zinc-50 to-white">
            <div className="bg-black text-white p-4 text-left font-sans text-lg fixed top-0 left-0 backdrop-blur w-screen z-10">
                Voice Assistant
            </div>
            <section className="flex flex-col flex-grow px-64 justify-start gap-4 pb-16 pt-20 overflow-y-auto">
                {chatLog.length > 0 || isListening || isThinking ? (
                    chatLog.map((msg, i) => <Message key={i} message={msg} />)
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 h-full w-full font-light">
                        <div className="flex">
                            <BookA
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-0"
                            />
                            <BookMarked
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-100"
                            />
                            <BookText
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-200"
                            />
                            <BookType
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-300"
                            />
                            <BookHeadphones
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-200"
                            />
                            <BookUser
                                size={28}
                                strokeWidth={1.1}
                                className="animate-bounce delay-100"
                            />
                            <BookAudio
                                size={28}
                                strokeWidth={1.1}
                                className=" animate-bounce delay-0"
                            />
                        </div>
                        <p className="text-xl text-zinc-600">
                            Hello! How can I help?
                        </p>
                    </div>
                )}
                {isListening && (
                    <Message message={{ role: "user", content: transcript }} />
                )}
                {isThinking && (
                    <Message
                        message={{
                            role: "assistant",
                            content: "",
                            type: "answer",
                            tooltips: {},
                        }}
                        loading
                    />
                )}
            </section>
            <div className="flex justify-center gap-2 py-4 fixed bottom-0 left-0 w-screen z-10 backdrop-blur bg-gradient-to-t from-zinc-300 to-transparent">
                {isListening ? (
                    <Button className="gap-2" disabled>
                        <Ear />
                        Listening...
                    </Button>
                ) : isTalking || isThinking ? (
                    <Button className="gap-2" disabled>
                        <BotMessageSquare />
                        Answering...
                    </Button>
                ) : (
                    <Button className="gap-2" onClick={listen}>
                        <Mic />
                        Ask a Question
                    </Button>
                )}
                <Button
                    onClick={() => {
                        toast({
                            title: !autoListen
                                ? "Auto listen on"
                                : "Auto listen off",
                        });
                        setAutoListen(!autoListen);
                    }}
                    size="icon"
                >
                    {autoListen ? <Ear /> : <EarOff />}
                </Button>
            </div>
        </div>
    );
}

export default App;
