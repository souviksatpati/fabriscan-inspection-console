import React, { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { Reveal } from '../common/Reveal';

const QUALITY_POINTS = [
  'Finds the flaw',
  'Measures it',
  'Records it',
] as const;

export const SurfaceQuality: React.FC = () => {
  const [imgSrc, setImgSrc] = useState('/images/souvik-cropped.webp');
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    // Fall back to original souvik.png if souvik-cropped.webp fails
    if (imgSrc !== '/images/souvik.png') {
      setImgSrc('/images/souvik.png');
    } else {
      setImgFailed(true);
    }
  };

  return (
    <section
      id="surface-quality"
      className="scroll-mt-24 w-full bg-[#FFFFFF] min-h-[32rem] lg:min-h-[80vh] flex items-center overflow-hidden"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] items-center">
        {/* Left Column: Image bleeds to the left viewport edge */}
        <div className="w-full min-w-0 overflow-hidden flex items-center justify-center lg:justify-end">
          <Reveal className="w-full flex items-center justify-center lg:justify-end">
            {imgFailed ? (
              <div
                className="w-full aspect-[2000/1173] bg-[#F1F5F9] flex items-center justify-center text-xs text-[#94A3B8]"
                aria-label="Stamped automotive body panel placeholder"
              >
                Stamped automotive body panel
              </div>
            ) : (
              <img
                src={imgSrc}
                alt="Stamped automotive body panel surface inspection"
                width={2000}
                height={1173}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-auto object-contain [object-position:right_center]"
              />
            )}
          </Reveal>
        </div>

        {/* Right Column: Copy & Value Points */}
        <div className="w-full min-w-0 flex items-center justify-start px-4 sm:px-6 lg:pl-8 lg:pr-8 py-10 lg:py-0">
          <Reveal delay={0.1} className="w-full max-w-[32rem]">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] 2xl:text-[3.5rem] font-extrabold text-[#0F172A] uppercase tracking-tight leading-[1.08] mb-5">
              SURFACE QUALITY
            </h2>

            <p className="text-[1.125rem] text-[#475569] leading-relaxed mb-8">
              Every panel checked before it moves on. Maruti FabriScan inspects each stamped part with a camera, measures any surface defect, and records a clear GOOD or NOT GOOD result.
            </p>

            <ul className="flex flex-col gap-4 sm:gap-5">
              {QUALITY_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <CircleCheck
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#15803D] shrink-0"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  <span className="text-[1.125rem] text-[#0F172A] font-medium leading-normal">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SurfaceQuality;
