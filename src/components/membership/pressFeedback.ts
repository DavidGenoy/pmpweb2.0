type PressEvent = { currentTarget: HTMLElement };

// Same immediate touch feedback pattern used elsewhere on the site (Footer,
// Services): toggle a class on touch so iOS shows the pressed state at once.
// Moving the finger (a scroll) cancels it.
export const PRESS_HANDLERS = {
  onTouchStart: (e: PressEvent) => e.currentTarget.classList.add("is-pressed"),
  onTouchMove: (e: PressEvent) => e.currentTarget.classList.remove("is-pressed"),
  onTouchEnd: (e: PressEvent) => e.currentTarget.classList.remove("is-pressed"),
  onTouchCancel: (e: PressEvent) => e.currentTarget.classList.remove("is-pressed"),
};

// Information cards: a subtle PMP green border and tint on press (and mouse
// down); a restrained border change on hover, which Tailwind only applies on
// hover-capable devices so it can't stick after a tap on iOS. The press scale
// is !important because the site's GSAP scroll reveal writes an inline
// `scale: none` on revealed elements.
export const PRESSABLE_CARD =
  "transition-[scale,border-color,background-color] duration-150 ease-out motion-reduce:transition-none hover:border-accent-500/35 active:scale-[0.99]! active:border-accent-500/55 active:bg-[#f2faf8] [&.is-pressed]:scale-[0.99]! [&.is-pressed]:border-accent-500/55 [&.is-pressed]:bg-[#f2faf8]";
