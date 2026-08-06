"use client";

import * as React from "react";

export function TransparentFrameOverrides() {
  React.useEffect(() => {
    // Force transparency on HTML and Body elements to avoid inheriting RootLayout colors
    document.body.style.setProperty("background", "transparent", "important");
    document.body.style.setProperty("background-color", "transparent", "important");
    document.body.style.overflow = "hidden";
    
    document.documentElement.style.setProperty("background", "transparent", "important");
    document.documentElement.style.setProperty("background-color", "transparent", "important");
    document.documentElement.style.overflow = "hidden";
  }, []);

  return null;
}
