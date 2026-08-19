"use client";

import { useEffect } from "react";

const OLD_PHONE = "tel:+17754096847";
const NEW_PHONE = "tel:+17754700219";
const NEW_LABEL = "CALL (775) 470-0219";

export default function PhoneNormalizer() {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(`a[href="${OLD_PHONE}"]`);
    links.forEach((link) => {
      link.href = NEW_PHONE;
      if (link.textContent?.includes("409-6847")) {
        link.textContent = NEW_LABEL;
      }
    });
  }, []);

  return null;
}
