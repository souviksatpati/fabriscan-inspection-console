import React from 'react';

/**
 * Slide Direction Control:
 * Set to 'normal' for right-to-left scrolling (default).
 * Set to 'reverse' for left-to-right scrolling.
 */
export const SLIDER_DIRECTION: 'normal' | 'reverse' = 'normal';

/**
 * Slide Cycle Duration:
 * 35s provides a constant, slow, and smooth cycle across 4 images.
 */
export const SLIDER_DURATION = '35s';

export interface HeroSlide {
  id: string;
  jpg: string;
  webp: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * 4 Automotive Spare Parts & Stamping Inspection Photographs
 * Files located in src/assets/images/ and public/images/
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'parts-1',
    jpg: '/images/parts-1.jpg',
    webp: '/images/parts-1.webp',
    alt: 'Stamped automotive sheet metal body panels on factory assembly conveyor line',
    width: 1000,
    height: 750,
  },
  {
    id: 'parts-2',
    jpg: '/images/parts-2.jpg',
    webp: '/images/parts-2.webp',
    alt: 'Automated industrial CNC sheet metal cutting and stamping inspection gantry',
    width: 1000,
    height: 750,
  },
  {
    id: 'parts-3',
    jpg: '/images/parts-3.jpg',
    webp: '/images/parts-3.webp',
    alt: 'High-precision machined and cast automotive powertrain assembly',
    width: 1000,
    height: 750,
  },
  {
    id: 'parts-4',
    jpg: '/images/parts-4.jpg',
    webp: '/images/parts-4.webp',
    alt: 'Robotic multi-axis chassis stamping and spot welding production cell',
    width: 1000,
    height: 750,
  },
];

export const HeroSlider: React.FC = () => {
  return (
    <div
      className="hero-slider-container group relative w-full overflow-hidden select-none bg-[#F5F7FA] rounded-[0.1875rem]"
      style={
        {
          '--slider-direction': SLIDER_DIRECTION,
          '--slider-duration': SLIDER_DURATION,
        } as React.CSSProperties
      }
      aria-label="Automotive spare parts and inspection imagery"
      role="region"
    >
      {/* Subtle edge fades matching the white background (#FFFFFF) exactly */}
      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Infinite loop track containing the slide set twice */}
      <div className="hero-slider-track flex">
        {/* Primary Set: Accessible to screen readers and keyboard focus */}
        <div className="hero-slider-group flex gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0">
          {HERO_SLIDES.map((slide, index) => {
            const isEager = index < 2;
            return (
              <div
                key={`primary-${slide.id}`}
                className="w-[80vw] max-w-[21.25rem] sm:w-[20rem] md:w-[21.25rem] lg:w-[22.5rem] aspect-[4/3] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-[0.1875rem] bg-[#F5F7FA] overflow-hidden"
                tabIndex={0}
                aria-label={slide.alt}
              >
                <picture>
                  <source srcSet={slide.webp} type="image/webp" />
                  <img
                    src={slide.jpg}
                    alt={slide.alt}
                    width={slide.width}
                    height={slide.height}
                    loading={isEager ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={isEager ? 'high' : 'auto'}
                    className="w-full h-full object-cover rounded-[0.1875rem] border border-[#D9DEE5]"
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Duplicate Set: Purely visual for seamless loop reset, marked aria-hidden */}
        <div
          className="hero-slider-duplicate flex gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0"
          aria-hidden="true"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={`duplicate-${slide.id}`}
              className="w-[80vw] max-w-[21.25rem] sm:w-[20rem] md:w-[21.25rem] lg:w-[22.5rem] aspect-[4/3] shrink-0 rounded-[0.1875rem] bg-[#F5F7FA] overflow-hidden"
              tabIndex={-1}
            >
              <picture>
                <source srcSet={slide.webp} type="image/webp" />
                <img
                  src={slide.jpg}
                  alt=""
                  width={slide.width}
                  height={slide.height}
                  loading="lazy"
                  decoding="async"
                  tabIndex={-1}
                  className="w-full h-full object-cover rounded-[0.1875rem] border border-[#D9DEE5]"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
