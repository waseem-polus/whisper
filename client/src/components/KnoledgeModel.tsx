type Res = {
    type: "command" | "answer";
    content: string;
    tooltips: { [key: string]: any };
};

const fetchChatGPTResponse = async (message: string): Promise<Res> => {
    return fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ message }),
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error("Error:", error);
        });
};

export default fetchChatGPTResponse;
