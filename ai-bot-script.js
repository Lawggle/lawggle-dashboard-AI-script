// Global variable to store memberstack ID
let memberstackId = "";

// Function to get memberstack ID and validate membership
async function getMemberstackId() {
  try {
    if (window.$memberstackDom) {
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (member) {
        memberstackId = member.id;
        const membershipPlan = member.planConnections[0];
        console.log("Member id:", memberstackId);
        console.log("Current membership plan:", membershipPlan);

        if (membershipPlan) {
          const membershipPlanId = membershipPlan.planId;
          console.log("Current membership ID:", membershipPlanId);

          const advancedMembershipPlanIds = [
            "pln_lawggle-advanced-v2-r74e0sgz",
            "pln_lawggle-advanced-v2-a6t0erf",
          ];

          if (!advancedMembershipPlanIds.includes(membershipPlanId)) {
            console.log(
              "User does not have an advanced plan. Chatbot will not be initialized."
            );
            return false; // Return false to indicate no advanced plan
          }
          return true; // Return true to indicate advanced plan found
        } else {
          console.warn(
            "Member is logged in but has no active membership plan."
          );
          return false;
        }
      } else {
        console.log("Not logged in");
        return false;
      }
    }
    return false; // Return false if $memberstackDom is not available
  } catch (error) {
    console.log("Error getting memberstack member:", error);
    return false;
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

  // More robust live environment detection
  const isLive = (() => {
    const hostname = window.location?.hostname?.toLowerCase();
    if (!hostname) return false;

    // List of production domains
    const liveDomains = ["www.lawggle.com", "lawggle.com"];
    return liveDomains.includes(hostname);
  })();

  const iframeUrl = `${base_url}/${slug}?auth=${auth}&memberstackid=${memberstackId}&isLive=${isLive}`;

  // Create the chatbot button
  var chatbotButton = document.createElement("button");
  chatbotButton.className = "orgo-chatbot-button";
  chatbotButton.id = "ai-bot-btn";

  chatbotButton.innerHTML =
    '<img src="https://cdn.prod.website-files.com/67e360f08a15ef65d8814b41/686369111a4a2c20343eeed7_lawggle-ai-bot.png" alt="Chatbot Icon" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
  document.body.appendChild(chatbotButton);

  // Create the chatbot iframe container
  var chatbotContainer = document.createElement("div");
  chatbotContainer.className = "orgo-chatbot-container";
  // No longer setting display: none, using CSS animations instead

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
  chatbotIframe.allow = "clipboard-write"; // Enable clipboard write permissions

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
            /* Animation properties */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(1);
        }

        .orgo-chatbot-button:hover {
            transform: scale(1.05);
            background: rgba(162, 195, 224, 0.3);
            box-shadow: 0 8px 25px rgba(146, 176, 202, 0.3);
        }

        .orgo-chatbot-button:active {
            transform: scale(0.95);
        }

        .orgo-chatbot-button.hidden {
            transform: scale(0);
            opacity: 0;
            visibility: hidden;
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
            background: white;
            display: flex;
            flex-direction: column;
            /* Animation properties */
            transform: translateY(100%) scale(0.8);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .orgo-chatbot-container.show {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
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
            /* Animation properties */
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(1);
        }

        .orgo-chatbot-close:hover {
            color: #333;
            background: rgba(255, 255, 255, 1);
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .orgo-chatbot-close:active {
            transform: scale(0.95);
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
                width: 120px;
                height: 120px;
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
                /* Mobile-specific animations */
                transform: translateY(100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .orgo-chatbot-container.show {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
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
        /(@media \(max-width: 768px\) \{[\s\S]*?)\.orgo-chatbot-container\s*\{[^}]*position:\s*fixed;[^}]*top:\s*60px;[^}]*\}/,
        `$1.orgo-chatbot-container {
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
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transform: translateY(100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
    if (!chatbotContainer.classList.contains("show")) {
      // Show the chatbot with animation
      chatbotContainer.classList.add("show");

      // Adjust for navbar on mobile
      adjustForNavbar();

      // Only disable scrolling on mobile devices
      if (isMobileDevice()) {
        document.body.classList.add("chatbot-open-mobile");
      }

      // Animate button out
      chatbotButton.classList.add("hidden");
    }
  });

  // Update close button functionality
  closeButton.addEventListener("click", function () {
    // Hide the chatbot with animation
    chatbotContainer.classList.remove("show");

    // Remove the mobile class in any case
    document.body.classList.remove("chatbot-open-mobile");

    // Show button with animation after a small delay
    setTimeout(() => {
      chatbotButton.classList.remove("hidden");
    }, 100);
  });
}

// Check if DOM is already loaded, otherwise wait for it
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    await getMemberstackId(); // Still get memberstack ID for the iframe URL
    initializeChatbot(); // Always initialize chatbot
  });
} else {
  // DOM is already loaded, get memberstack ID then initialize
  getMemberstackId().then(() => {
    initializeChatbot(); // Always initialize chatbot
  });
}
