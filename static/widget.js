const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const makeOrderButton = document.querySelector(".quick-reply-button");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

document.getElementById("drop-menu").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    if (menu.style.visibility === "hidden") {
        menu.style.visibility = "visible";
    } else {
        menu.style.visibility = "hidden";
    }
});


// ...
// Define a function to create option buttons
function createOptionButtons(options) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("option-buttons");

    options.forEach((option) => {
        const optionButton = document.createElement("button");
        optionButton.classList.add("emoji-button");
        optionButton.setAttribute("data-value", option.label); // Store the option label as data-value

        optionButton.innerText = option.label;
        buttonContainer.appendChild(optionButton);
    });

    return buttonContainer;
}

chatInput.addEventListener("input", () => {
//adjust the height of textarea based on its content 
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
// if enter key is pressed without a Shift key and the window
// width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Assuming your Flask server is running on http://localhost:5000
var ratingAsked = false;

async function handleChat() {
  userMessage = chatInput.value;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Adjust the height of the header
  const chatbotHeader = document.querySelector('.chatbot header');
  const originalHeaderHeight = chatbotHeader.clientHeight;
  chatbotHeader.style.height = `${originalHeaderHeight - 30}px`; // Adjust the height as needed
  // Hide span elements
  const spanElements = document.querySelectorAll('.chatbot header span');
  spanElements.forEach((element) => {
    element.style.display = 'none';
  });

  // Display "Thinking..." message while waiting for response
  const thinkingLi = createChatLi("Thinking...", "incoming");
  const thinkingMessageElement = thinkingLi.querySelector("p");
  chatbox.appendChild(thinkingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  try {
    // Assuming your Flask server is running on http://localhost:5000
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userMessage }),
    });

    const data = await response.json();

    // Replace the "Thinking..." message with the actual response data
    thinkingMessageElement.textContent = data.response;

    // Update the chat UI with the AI response
    const incomingChatLi = createChatLi(data.response, "incoming");
    chatbox.replaceChild(incomingChatLi, thinkingLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

  } catch (error) {
    console.error("Error:", error);
    // Handle errors, for example, display an error message in the chatbox
    const errorChatLi = createChatLi("Error occurred. Please try again.", "incoming");
    chatbox.replaceChild(errorChatLi, thinkingLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } // Check if the rating has not been asked yet
          if (!ratingAsked) {
            // Add the ratingContainer to the chatbox before appending the rating message
            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating-container"); // Add the "rating-container" class
            chatbox.appendChild(ratingContainer);
    
            setTimeout(() => {
              const ratingMessage = createChatLi(
                "How would you rate this conversation? Choose emoji:",
                "incoming"
              );
    
              // Add the "rating-message" class to the rating message element
              ratingMessage.classList.add("rating-message");
    
              const emojis = ["😃", "😐", "😞"];
              const emojiButtons = document.createElement("div");
              emojiButtons.classList.add("emoji-buttons");
    
              emojis.forEach((emoji) => {
                const emojiButton = document.createElement("button");
                emojiButton.classList.add("emoji-button");
                emojiButton.innerText = emoji;
    
                emojiButton.addEventListener("click", () => {
                  // Handle the user's rating here, e.g., send it to your server
                  const selectedEmoji = emoji; // This is the selected emoji
                  // You can send the rating to your server or perform any other action
    
                  // Add a message indicating the selected rating
                  const ratingResponse = createChatLi(
                    `Ви оцінили розмову як: ${selectedEmoji}`,
                    "incoming"
                  );
    
                  chatbox.appendChild(ratingResponse);
                  chatbox.scrollTo(0, chatbox.scrollHeight);
                });
    
                emojiButtons.appendChild(emojiButton);
              });
    
              ratingMessage.appendChild(emojiButtons);
              ratingContainer.appendChild(ratingMessage); // Add the rating message to the rating container
              chatbox.scrollTo(0, chatbox.scrollHeight);
    
              // Set the ratingAsked flag to true to prevent asking again
              ratingAsked = true;
            }, 3000); // Wait for 3 seconds (3000 milliseconds
          }
        }

// Add the event listener for the button outside the function
sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

function updateOptionsButtons(options) {
  const quickReplyList = document.querySelector('.chat.quick-reply');

  if (options.buttons) {
    quickReplyList.innerHTML = ''; // Remove existing buttons

    options.buttons.forEach((buttonText, index) => {
      const buttonId = `quick-reply-button-${index}`;
      const buttonElement = document.createElement('button');
      buttonElement.className = 'quick-reply-button';
      buttonElement.textContent = buttonText;
      buttonElement.id = buttonId; // Assign a unique ID to the button
      quickReplyList.appendChild(buttonElement);

      // Add a click event listener for each button
      buttonElement.addEventListener('click', () => {
        // Handle the click event for the button with the specified ID
        switch (buttonId) {
          case 'quick-reply-button-0':
            // Handle the click for the first button
            incomingChatLi = createChatLi("Button 1 clicked", "incoming");
            messageElement = incomingChatLi.querySelector("p");

            // Display thinking message while waiting for response
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            break;
          case 'quick-reply-button-1':
            // Handle the click for the second button
            incomingChatLi = createChatLi("Thinking...", "incoming");
            messageElement = incomingChatLi.querySelector("p");
        
            // Display thinking message while waiting for response
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            break;
          // Add more cases for other buttons as needed
          default:
            break;
        }
      });
    });
  }

  if (options.quickReplyBackground) {
    quickReplyList.style.background = options.quickReplyBackground;
  }

  // Customize .quick-reply-button
  const quickReplyButtons = document.querySelectorAll('.quick-reply-button');

  // Loop through all the buttons except the last one
  for (let i = 0; i < quickReplyButtons.length - 1; i++) {
    const button = quickReplyButtons[i];

    if (options.quickReplyButtonBackground) {
      button.style.background = options.quickReplyButtonBackground;
    }
    if (options.quickReplyButtonBorderBottom) {
      button.style.borderBottom = options.quickReplyButtonBorderBottom;
    }
  }

  // Now, target the last button and remove its border-bottom
  const lastButton = quickReplyButtons[quickReplyButtons.length - 1];
  if (options.quickReplyButtonBackground) {
    lastButton.style.background = options.quickReplyButtonBackground;
  }
  // Remove the border-bottom for the last button
  lastButton.style.borderBottom = 'none';
}

function customizeChatbot(options) {

  updateOptionsButtons(options);

  // Customize .chatbot
  const chatbot = document.querySelector('.chatbot');
  if (options.chatbotBackground) {
    chatbot.style.background = options.chatbotBackground;
  }

  // Customize .chatbot-toggler
  const chatbotToggler = document.querySelector('.chatbot-toggler');
  if (options.chatbotTogglerBackground) {
    chatbotToggler.style.background = options.chatbotTogglerBackground;
  }
  if (options.chatbotTogglerPosition) {
    chatbotToggler.style.right = options.chatbotTogglerPosition.right;
    chatbotToggler.style.bottom = options.chatbotTogglerPosition.bottom;
  }
  if (options.chatbotTogglerSize) {
    chatbotToggler.style.height = options.chatbotTogglerSize.height;
    chatbotToggler.style.width = options.chatbotTogglerSize.width;
  }

  // Customize .chatbot header
  const chatbotHeader = document.querySelector('.chatbot header');
  if (options.chatbotHeaderBackground) {
    chatbotHeader.style.background = options.chatbotHeaderBackground;
  }

  // Customize .chatbot header h2
  const h2Elements = document.querySelectorAll('.chatbot header h2');
  h2Elements.forEach((element) => {
    if (options.h2Color) {
      element.style.color = options.h2Color;
    }
    if (options.h2FontSize) {
      element.style.fontSize = options.h2FontSize;
    }
  });

  // Customize .chatbot header span
  const spanElements = document.querySelectorAll('.chatbot header span');
  spanElements.forEach((element) => {
    if (options.spanColor) {
      element.style.color = options.spanColor;
    }
  });

  // Customize .chatbox .incoming span
  const incomingSpan = document.querySelector('.chatbox .incoming span');
  if (options.incomingSpanBackground) {
    incomingSpan.style.background = options.incomingSpanBackground;
  }
  if (options.incomingSpanColor) {
    incomingSpan.style.color = options.incomingSpanColor;
  }

  // Customize .chatbox .incoming p
  const incomingP = document.querySelector('.chatbox .incoming p');
  if (options.incomingPColor) {
    incomingP.style.color = options.incomingPColor;
  }
  if (options.incomingPBackground) {
    incomingP.style.background = options.incomingPBackground;
  }
  // Customize .chatbox .chat p
  const chatPElements = document.querySelectorAll('.chatbox .chat p');
  chatPElements.forEach((element) => {
    if (options.chatPColor) {
      element.style.color = options.chatPColor;
    }
    if (options.chatPMaxWidth) {
      element.style.maxWidth = options.chatPMaxWidth;
    }
    if (options.chatPFontSize) {
      element.style.fontSize = options.chatPFontSize;
    }
    if (options.chatPBackground) {
      element.style.background = options.chatPBackground;
    }
  });
  // Customize .menu
  const menu = document.querySelector('.menu');
  if (options.menuWidth) {
    menu.style.width = options.menuWidth;
  }
  if (options.menuHeight) {
    menu.style.height = options.menuHeight;
  }
  if (options.menuBackground) {
    menu.style.background = options.menuBackground;
  }

  // Customize .logo
  const logo = document.querySelector('.logo');
  if (options.logoColor) {
    logo.style.color = options.logoColor;
  }
  if (options.logoOpacity) {
    logo.style.opacity = options.logoOpacity;
  }
  if (options.logoTextAlign) {
    logo.style.textAlign = options.logoTextAlign;
  }
  if (options.logoPaddingLeft) {
    logo.style.paddingLeft = options.logoPaddingLeft;
  }
  if (options.logoPaddingTop) {
    logo.style.paddingTop = options.logoPaddingTop;
  }

  // Customize message in <header>
  const headerH2 = document.querySelector('.chatbot header h2');
  if (options.headerMessage) {
    headerH2.innerHTML = options.headerMessage;
  }

  // Customize content in <div class="logo">
  const logoDiv = document.querySelector('.logo');
  if (options.logoContent) {
    logoDiv.innerHTML = options.logoContent;
  }

  // Customize placeholder for the chat input
  const chatInput = document.querySelector('.chat-input textarea');
  if (options.inputPlaceholder) {
    chatInput.placeholder = options.inputPlaceholder;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  customizeChatbot({
    chatbotBackground: 'blue',
    chatbotTogglerBackground: 'green',
    chatbotTogglerPosition: {
      right: '10px',
      bottom: '10px',
    },
    chatbotTogglerSize: {
      height: '50px',
      width: '50px',
    },
    chatbotHeaderBackground: 'orange',
    h2Color: 'white',
    h2FontSize: '1.5rem',
    spanColor: 'yellow',
    quickReplyBackground: 'green',
    quickReplyButtonBorderBottom: '10px solid red',
    quickReplyButtonBackground: 'green',
    chooseOptionH3Color: 'black',
    incomingSpanBackground: 'blue',
    incomingSpanColor: 'white',
    incomingPColor: 'black',
    incomingPBackground: 'white',
    chatPColor: 'white',
    chatPMaxWidth: '75%',
    chatPFontSize: '0.95rem',
    chatPBackground: '#724ae8',
    menuWidth: '100px',
    menuHeight: '50px',
    menuBackground: '#fff',
    logoColor: '#fff',
    logoOpacity: '80%',
    logoTextAlign: 'left',
    logoPaddingLeft: '20px',
    logoPaddingTop: '10px',
    headerMessage: 'Custom Welcome Message',
    logoContent: `
      To ShiBOT live chat with AI company.<br>
      We're always online and ready to chat!
    `,
    buttons: ['Option 1', 'Option 2', 'Option 3'], // Add or delete buttons
    inputPlaceholder: 'Enter your message...',
  });
});
