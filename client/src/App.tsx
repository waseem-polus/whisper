import { useEffect, useState } from "react";
import "./App.css";
import { useVoiceRecognition, speak } from "./components/VoiceRecognition";
import { Button } from "./components/ui/button";
import Message, { Msg } from "./components/Message";
import fetchChatGPTResponse from "./components/KnoledgeModel";
import { BotMessageSquare, Ear, Mic } from "lucide-react";

function App() {
    const [chatLog, setChatLog] = useState<Array<Msg>>([
        {
            role: "assistant",
            type: "answer",
            content: "<<Hello>>! How can I <<help>> you?",
            tooltips: {
                Hello: "A really cool greeting!",
                help: "A synonym of assisting someone",
            },
        },
    ]);
    const { listen, transcript, isListening, clearTranscript } =
        useVoiceRecognition();
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isTalking, setIsTalking] = useState<boolean>(false);

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
                speak(res.content, setIsTalking);
            });
            clearTranscript();
        }
    }, [isListening]);

    return (
        <div className="w-screen h-screen flex flex-col pb-4 justify-end">
            <div className="bg-black text-white p-4 text-left font-sans text-lg">
                Voice Assistant
            </div>
            <section className="bg-white flex flex-col flex-grow py-4 mx-64 justify-start overflow-y-auto gap-2">
                {chatLog.map((msg, i) => (
                    <Message key={i} message={msg} />
                ))}
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
            <div className="flex justify-center gap-2">
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
            </div>
        </div>
    );
}

export default App;
