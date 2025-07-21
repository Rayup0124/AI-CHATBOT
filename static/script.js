// 文件路径: static/script.js
// 这是【解决重复问好问题】的最终版本

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const userInputField = document.getElementById('userInput');
    const chatMessagesContainer = document.getElementById('chat-messages');

    let initialSystemPrompt = ''; // 用于存储包含问好指令的完整提示
    let followUpSystemPrompt = ''; // 用于存储不含问好指令的纯文档内容
    let isFirstMessage = true; // 这是我们的“开关”，默认为 true

    // 页面加载后，获取 material.txt 并准备两种提示
    fetch('/material.txt')
        .then(response => response.text())
        .then(text => {
            initialSystemPrompt = text.trim();
            console.log("Initial system prompt loaded.");

            // 创建一个只包含文档内容的后续提示
            // 我们通过寻找 "--- Start of Document ---" 并取其之后的内容来实现
            const separator = "--- Start of Document ---";
            const separatorIndex = text.indexOf(separator);
            if (separatorIndex !== -1) {
                followUpSystemPrompt = text.substring(separatorIndex + separator.length).trim();
            } else {
                // 如果找不到分隔符，就用完整内容作为备用
                followUpSystemPrompt = initialSystemPrompt;
            }
        })
        .catch(error => console.error('加载 material.txt 失败:', error));

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
        if (!userInput.trim()) return;

        displayMessage("You", userInput, true);
        userInputField.value = '';

        // 决定使用哪个 system_prompt
        const promptToSend = isFirstMessage ? initialSystemPrompt : followUpSystemPrompt;

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userInput,
                system_prompt: promptToSend // 发送我们选择好的提示
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                displayMessage("Chatbot", data.message, false);
            } else {
                displayMessage("Chatbot", "没有响应，请重试。", false);
            }
        })
        .catch(error => {
            console.error('错误:', error);
            displayMessage("Chatbot", "获取响应失败。", false);
        });

        // 在第一次发送消息后，立即关闭“开关”
        if (isFirstMessage) {
            isFirstMessage = false;
        }
    }

    function displayMessage(sender, message, isUser) {
        // 这部分代码保持不变
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