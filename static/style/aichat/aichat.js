const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = 'dc5f122151msh883ed682cbadc9cp113b09jsn67cb02e5ab7d';
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, classname) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", classname);
    let chatContent = classname === "outgoing" ? `<p>${message}</p>` : `<i class="fa-solid fa-robot"></i><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateRespone = (incoimngChatLi) => {
    const API_URL = 'https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions';
    const messageElement = incoimngChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'chatgpt-best-price.p.rapidapi.com'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        })
    }
    // Send POST request to API, get respone
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Đã xảy ra lỗi. Bạn vui lòng chờ trong giây lát và thử lại"
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Remove spaces in string usermessage
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //Append user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display Thinking... on your display
        const incoimngChatLi = createChatLi('Đang nghĩ...', "incoming")
        chatbox.appendChild(incoimngChatLi);
        generateRespone(incoimngChatLi);
    }, 600)
}

chatInput.addEventListener("input", () => {
    // Adjust the bate height of the input textarea based on content
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
      // Trigger the button element with a click
        event.preventDefault();
        handleChat();
    }
  });

sendChatBtn.addEventListener('click', handleChat);
