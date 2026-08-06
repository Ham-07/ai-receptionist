(function () {
  // Find script element to retrieve business ID
  const scriptEl =
    document.currentScript ||
    document.querySelector("script[data-business-id]");
  if (!scriptEl) {
    console.error("AI Receptionist: Script element not found.");
    return;
  }

  const businessId = scriptEl.getAttribute("data-business-id");
  if (!businessId) {
    console.error("AI Receptionist: data-business-id attribute is missing.");
    return;
  }

  // Determine base URL from the script source URL
  let baseUrl = "http://localhost:3000";
  if (scriptEl.src) {
    try {
      const url = new URL(scriptEl.src);
      baseUrl = url.origin;
    } catch (e) {
      console.error("AI Receptionist: Failed to parse script origin.", e);
    }
  }

  // Create iframe element
  const iframe = document.createElement("iframe");
  iframe.src = `${baseUrl}/widget?businessId=${encodeURIComponent(businessId)}`;
  iframe.title = "AI Receptionist Chat Widget";
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.style.right = "0";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.display = "none"; // Hide initially until it signals it is ready
  iframe.style.background = "transparent";
  iframe.style.colorScheme = "none";
  iframe.setAttribute("allowtransparency", "true");

  document.body.appendChild(iframe);

  let currentState = "closed-only";
  let currentPosition = "bottom-right";

  function applyDimensions() {
    const isMobile = window.innerWidth < 640;

    // Reset styles
    iframe.style.bottom = "0";

    if (currentState === "open") {
      if (isMobile) {
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.left = "0";
        iframe.style.right = "0";
      } else {
        iframe.style.width = "420px";
        iframe.style.height = "680px";
        if (currentPosition === "bottom-left") {
          iframe.style.left = "0";
          iframe.style.right = "auto";
        } else {
          iframe.style.right = "0";
          iframe.style.left = "auto";
        }
      }
    } else if (currentState === "closed-teaser") {
      iframe.style.width = "320px";
      iframe.style.height = "200px";
      if (currentPosition === "bottom-left") {
        iframe.style.left = "0";
        iframe.style.right = "auto";
      } else {
        iframe.style.right = "0";
        iframe.style.left = "auto";
      }
    } else {
      // closed-only
      iframe.style.width = "90px";
      iframe.style.height = "90px";
      if (currentPosition === "bottom-left") {
        iframe.style.left = "0";
        iframe.style.right = "auto";
      } else {
        iframe.style.right = "0";
        iframe.style.left = "auto";
      }
    }
  }

  // Listen for message events from our iframe widget
  window.addEventListener("message", function (event) {
    if (event.origin !== baseUrl) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.type === "receptionist-init") {
      currentPosition = data.position || "bottom-right";
      iframe.style.display = "block";
      applyDimensions();
    }

    if (data.type === "receptionist-resize") {
      currentState = data.state || "closed-only";
      applyDimensions();
    }
  });

  // Re-evaluate dimensions on screen resize (e.g. rotating phone or resizing window)
  window.addEventListener("resize", applyDimensions);
})();
