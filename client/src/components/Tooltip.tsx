import { BookA } from "lucide-react";

type props = {
    word: string;
    definition: string;
};

const Tooltip = ({ word, definition }: props) => {
    return (
        <div className="flex gap-4 place-items-center">
            <div className="min-w-8 grid place-items-center">
                <BookA size={32} strokeWidth={1.4} />
            </div>
            <div className="flex flex-col justify-start text-left">
                <h1 className="text-md font-semibold">{word}</h1>
                <p className="text-sm font-light">{definition}</p>
            </div>
        </div>
    );
};

export default Tooltip;
