import type { SyntheticEvent } from "react";

export const EVENT_IMAGE_FALLBACK = "/cover.jpg";

export function eventImageSrc(src?: string | null): string {
  const value = typeof src === "string" ? src.trim() : "";
  return value.length > 0 ? value : EVENT_IMAGE_FALLBACK;
}

export function handleEventImageError(
  event: SyntheticEvent<HTMLImageElement, Event>,
): void {
  const el = event.currentTarget;
  if (el.dataset.fallback === "true") return;
  el.dataset.fallback = "true";
  el.src = EVENT_IMAGE_FALLBACK;
}
