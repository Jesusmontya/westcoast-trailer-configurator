"use client";

import { useEffect } from "react";

const projectByName: Record<string, string> = {
  "Captain Calabash": "captain-calabash",
  "Left Coast Pizza": "left-coast-pizza",
  "Pancho's Tacos": "panchos-tacos",
  "Rico's Mexican Food": "ricos-mexican-food",
  "Tortilleria Rey Tacamba": "tortilleria-rey-tacamba",
};

export default function GalleryLinkFixer() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href="#custom-build"]');
      if (!link) return;

      const image = link.querySelector<HTMLImageElement>("img[alt]");
      const name = image?.alt?.trim();
      const slug = name ? projectByName[name] : undefined;
      if (!slug) return;

      event.preventDefault();
      window.location.assign(`/projects/${slug}`);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
