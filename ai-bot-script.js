// Global variable to store memberstack ID
let memberstackId = "";

// Function to get memberstack ID
async function getMemberstackId() {
  try {
    if (window.$memberstackDom) {
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (member) {
        memberstackId = member.id;
        console.log("Member id:", memberstackId);
      } else {
        console.log("Not logged in");
      }
    }
  } catch (error) {
    console.log("Error getting memberstack member:", error);
  }
}

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

  const base_url = "https://lawggle-dashboard-ai-bot.vercel.app";
  const iframeUrl = `${base_url}/${slug}?auth=${auth}&memberstackid=${memberstackId}`;

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

  // Create header with close button (will be positioned absolutely)
  var headerDiv = document.createElement("div");
  headerDiv.className = "orgo-chatbot-header";

  var closeButton = document.createElement("button");
  closeButton.className = "orgo-chatbot-close";
  closeButton.innerHTML = "✕";
  headerDiv.appendChild(closeButton);

  // Create iframe first (full height)
  var chatbotIframe = document.createElement("iframe");
  chatbotIframe.src = iframeUrl; // Use the URL with memberstack ID
  chatbotIframe.style.width = "100%";
  chatbotIframe.style.height = "100%"; // Full height now
  chatbotIframe.style.border = "none";
  chatbotIframe.style.display = "block"; // Ensure proper display
  chatbotIframe.style.borderRadius = "16px"; // Match container border radius
  chatbotIframe.style.flex = "1"; // Take available space in flex container

  // Add iframe and header to container
  chatbotContainer.appendChild(chatbotIframe);
  chatbotContainer.appendChild(headerDiv); // Header added after iframe to appear on top
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
            overflow: hidden; /* Keep hidden to maintain rounded corners */
            transition: all 0.3s ease;
            background: white;
            display: flex;
            flex-direction: column;
        }

        .orgo-chatbot-header {
            position: absolute; /* Position absolutely on top of iframe */
            top: 10px;
            right: 0;
            height: 40px;
            background: transparent; /* Transparent background */
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 10px;
            z-index: 1000; /* Ensure it's above the iframe */
            width: auto; /* Only take space needed for the close button */
        }

        .orgo-chatbot-close {
            background: rgba(255, 255, 255, 0.9); /* Semi-transparent white background for visibility */
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 8px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                position: fixed;
                top: 60px; /* Default safe margin for navbar */
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: calc(100% - 60px);
                border-radius: 0;
                border: none;
                z-index: 999;
                overflow: hidden; /* Keep hidden for consistent behavior */
                display: flex;
                flex-direction: column;
            }

            .orgo-chatbot-header {
                position: absolute; /* Keep absolute positioning on mobile */
                top: 10px; /* Add some margin from the very top */
                right: 10px; /* Add some margin from the edge */
                height: 50px;
                padding: 0;
                background: transparent; /* Keep transparent background */
                z-index: 1001; /* Higher z-index to ensure it's always on top */
                width: auto;
            }

            .orgo-chatbot-close {
                font-size: 18px;
                padding: 10px;
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.9); /* Maintain semi-transparent background */
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
        }
    `;
  document.head.appendChild(style);

  // Check if device is mobile
  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  // Function to detect navbar height and adjust container
  const adjustForNavbar = () => {
    if (!isMobileDevice()) return; // Only adjust on mobile

    // Primary navbar selector for your specific site
    const primaryNavbarSelector = ".shell_sidebar-wrapper-2";

    let navbarHeight = 0;

    // Try to find the specific navbar
    const primaryNavbar = document.querySelector(primaryNavbarSelector);
    if (primaryNavbar) {
      const rect = primaryNavbar.getBoundingClientRect();

      // Check if it's positioned at or near the top
      if (rect.top <= 20) {
        navbarHeight = rect.bottom;
        console.log(
          `Found navbar with class ${primaryNavbarSelector}, height: ${navbarHeight}px`
        );
      }
    }

    // Apply the navbar offset to mobile container
    if (navbarHeight > 0) {
      const style = document.querySelector("style");
      const currentCSS = style.innerHTML;

      // Replace the mobile container styles with navbar offset
      const updatedCSS = currentCSS.replace(
        /\.orgo-chatbot-container\s*{[^}]*position:\s*fixed;[^}]*top:\s*60px;[^}]*}/,
        `.orgo-chatbot-container {
                position: fixed;
                top: ${navbarHeight}px;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: calc(100% - ${navbarHeight}px);
                border-radius: 0;
                border: none;
                z-index: 999;
            }`
      );

      style.innerHTML = updatedCSS;
      console.log(
        `Adjusted chatbot container for navbar height: ${navbarHeight}px`
      );
    } else {
      console.log("No navbar detected, using default positioning");
    }
  };

  // Toggle chatbot visibility on button click
  chatbotButton.addEventListener("click", function () {
    if (chatbotContainer.style.display === "none") {
      chatbotContainer.style.display = "";

      // Adjust for navbar on mobile
      adjustForNavbar();

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
  document.addEventListener("DOMContentLoaded", async () => {
    await getMemberstackId();
    initializeChatbot();
  });
} else {
  // DOM is already loaded, get memberstack ID then initialize
  getMemberstackId().then(() => {
    initializeChatbot();
  });
}
