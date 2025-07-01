// Function to initialize the chatbot
function initializeChatbot() {
  // More robust script tag detection
  const getScriptTag = () => {
    const scriptTags = document.getElementsByTagName("script");
    for (let script of scriptTags) {
      if (script.hasAttribute("slug") && script.hasAttribute("auth")) {
        return script;
      }
    }
    return null;
  };

  const scriptTag = getScriptTag();
  if (!scriptTag) {
    console.error(
      "Chatbot initialization failed: Missing required attributes (slug, auth)"
    );
    return;
  }

  const slug = scriptTag.getAttribute("slug");
  const auth = scriptTag.getAttribute("auth");
  const profilePicUrl = scriptTag.getAttribute("profile-pic-url");
  const base_url = "https://lawggle-dashboard-ai-bot.vercel.app";
  const iframeUrl = profilePicUrl
    ? `${base_url}/${slug}?auth=${auth}&profilePicUrl=${encodeURIComponent(
        profilePicUrl
      )}`
    : `${base_url}/${slug}?auth=${auth}`;

  // Create the chatbot button
  var chatbotButton = document.createElement("button");
  chatbotButton.className = "orgo-chatbot-button";
  chatbotButton.innerHTML =
    '<img src="https://cdn.prod.website-files.com/67e360f08a15ef65d8814b41/686369111a4a2c20343eeed7_lawggle-ai-bot.png" alt="Chatbot Icon" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
  document.body.appendChild(chatbotButton);

  // Create the chatbot iframe container
  var chatbotContainer = document.createElement("div");
  chatbotContainer.className = "orgo-chatbot-container";
  chatbotContainer.style.display = "none"; // Hidden by default

  // Create header
  var headerDiv = document.createElement("div");
  headerDiv.className = "orgo-chatbot-header";

  var closeButton = document.createElement("button");
  closeButton.className = "orgo-chatbot-close";
  closeButton.innerHTML = "✕";
  headerDiv.appendChild(closeButton);

  // Modify chatbot container structure
  chatbotContainer.appendChild(headerDiv);
  var chatbotIframe = document.createElement("iframe");
  chatbotIframe.src = iframeUrl; // Use dynamic URL
  chatbotIframe.style.width = "100%";
  chatbotIframe.style.height = "calc(100% - 40px)"; // Adjust for header height
  chatbotIframe.style.border = "none"; // Add this line to remove the border
  chatbotContainer.appendChild(chatbotIframe);
  document.body.appendChild(chatbotContainer);

  // Add styles for the button and container
  var style = document.createElement("style");
  style.innerHTML = `
        .orgo-chatbot-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: white;
            border: none;
            width: 80px;  /* Increased from 60px */
            height: 80px; /* Increased from 60px */
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 0;
            background: rgba(162, 195, 224, 0.2); /* Set to 20% opacity */
            border-radius: 50%; /* Added to ensure container is circular */
            overflow: hidden; /* Ensure video stays within circle */
            border: 2px solid #92B0CA;
        }

        .orgo-chatbot-button.hidden {
            display: none;
        }

        .orgo-chatbot-container {
            position: fixed;
            bottom: 24px; /* Position above the button (60px button + 20px margin + 10px gap) */
            right: 20px;
            width: 400px;
            height: 75%;
            border-radius: 16px;
            border: 1px solid #ccc;
            z-index: 999;
            overflow: hidden;
            transition: all 0.3s ease;
            background: white;
        }

        .orgo-chatbot-header {
            height: 40px;
            background: #f5f5f5;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 10px;
        }

        .orgo-chatbot-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 5px;
        }

        .orgo-chatbot-close:hover {
            color: #333;
        }

        /* Add a class to handle mobile overflow */
        body.chatbot-open-mobile {
            overflow: hidden;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
            .orgo-chatbot-button {
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
            }

            .orgo-chatbot-container {
                bottom: 0;
                right: 0;
                left: 0;
                top: 0;
                width: 100%;
                height: 90%;
                border-radius: 0;
                border: none;
            }

            .orgo-chatbot-header {
                height: 50px;
                padding: 0 15px;
            }

            .orgo-chatbot-close {
                font-size: 24px;
                padding: 10px;
            }
        }
    `;
  document.head.appendChild(style);

  // Check if device is mobile
  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  // Toggle chatbot visibility on button click
  chatbotButton.addEventListener("click", function () {
    if (chatbotContainer.style.display === "none") {
      chatbotContainer.style.display = "";

      // Only disable scrolling on mobile devices
      if (isMobileDevice()) {
        document.body.classList.add("chatbot-open-mobile");
      }

      chatbotButton.classList.add("hidden");
    }
  });

  // Update close button functionality
  closeButton.addEventListener("click", function () {
    chatbotContainer.style.display = "none";

    // Remove the mobile class in any case
    document.body.classList.remove("chatbot-open-mobile");

    chatbotButton.classList.remove("hidden");
  });
}

// Check if DOM is already loaded, otherwise wait for it
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeChatbot);
} else {
  // DOM is already loaded, initialize immediately
  initializeChatbot();
}
