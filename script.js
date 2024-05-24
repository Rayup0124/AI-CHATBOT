document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const userInputField = document.getElementById('userInput');
    const chatMessagesContainer = document.getElementById('chat-messages');

    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    userInputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = userInputField.value;
        displayMessage("You", userInput, true);
        userInputField.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                displayMessage("Chatbot: ", data.message, false);
            } else {
                displayMessage("Chatbot", "No response, try again.", false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage("Chatbot", "Failed to get a response.", false);
        });
    }

    function displayMessage(sender, message, isUser) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add(isUser ? "user-message" : "chatbot-message");

        const senderElement = document.createElement("strong");
        senderElement.textContent = `${sender}: `;

        const messageElement = document.createElement("span");
        messageElement.textContent = message;

        messageContainer.appendChild(senderElement);
        messageContainer.appendChild(messageElement);

        chatMessagesContainer.appendChild(messageContainer);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
});
