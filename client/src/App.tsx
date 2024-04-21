import { useEffect, useState } from "react";
import "./App.css";
import { useVoiceRecognition, speak } from "./components/VoiceRecognition";
import { Button } from "./components/ui/button";
import Message from "./components/Message";
import fetchChatGPTResponse from "./components/KnoledgeModel";
import { BotMessageSquare, Ear, Loader2, Mic } from "lucide-react";

type Msg = {
    human: boolean;
    text: string;
};

function App() {
    const [chatLog, setChatLog] = useState<Array<Msg>>([
        { human: false, text: "Hello! How can I help you?" },
    ]);
    const { listen, transcript, isListening, clearTranscript } =
        useVoiceRecognition();
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isTalking, setIsTalking] = useState<boolean>(false);

    useEffect(() => {
        if (!isListening && transcript != "") {
            setChatLog([...chatLog, { human: true, text: transcript }]);

            setIsThinking(true);
            fetchChatGPTResponse(transcript).then((res) => {
                setChatLog([
                    ...chatLog,
                    { human: true, text: transcript },
                    { human: false, text: res.msg },
                ]);
                speak(res.msg, setIsTalking);
            });
            clearTranscript();
            setIsThinking(false);
        }
    }, [isListening]);

    return (
        <div className="w-screen h-screen flex flex-col pb-4 justify-end">
            <div className="bg-black text-white p-4 text-left font-sans text-lg">
                Voice Assistant
            </div>
            <section className="flex flex-col p-8 justify-start h-full overflow-y-auto gap-2">
                {chatLog.map((msg, i) => (
                    <Message key={i} human={msg.human} text={msg.text} />
                ))}
                {isListening && <Message human={true} text={transcript} />}
                {isThinking && (
                    <Message
                        human={false}
                        text={<Loader2 className="animate-spin" />}
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
