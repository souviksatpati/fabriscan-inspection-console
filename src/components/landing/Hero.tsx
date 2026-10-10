import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroSlider } from './HeroSlider';
import { Button } from '../ui/button';
import { useRole } from '../../hooks/useRole';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeadlineLine {
  content: React.ReactNode;
}

const HEADLINE_LINES: HeadlineLine[] = [
  {
    content: <span className="text-[#0F172A]">Surface defect</span>,
  },
  {
    content: (
      <>
        <span className="text-[#1D4ED8]">inspection</span>
        <span className="text-[#0F172A]"> for</span>
      </>
    ),
  },
  {
    content: (
      <>
        <span className="text-[#0F172A]">stamped </span>
        <span className="text-[#0E7490]">automotive</span>
      </>
    ),
  },
  {
    content: <span className="text-[#0E7490]">parts.</span>,
  },
];

const EASE_CUBIC = [0.22, 1, 0.36, 1] as const;

export const Hero: React.FC = () => {
  const { isAuthenticated } = useRole();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="scroll-mt-24 relative w-full flex items-center justify-center min-h-[90dvh] pt-24 sm:pt-28 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-10 lg:gap-12">
          {/* Left Column: Eyebrow, Large Fluid Headline, Paragraph, Actions */}
          <div className="w-full flex flex-col items-start text-left">
            {/* Small mono eyebrow with diamond icon: fade up 0.6s starting at time 0 */}
            {prefersReducedMotion ? (
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Diamond className="w-3.5 h-3.5 text-[#1D4ED8] fill-[#1D4ED8]/20 shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs sm:text-[0.8125rem] font-semibold text-[#1D4ED8] tracking-wider uppercase">
                  AUTOMATED OPTICAL INSPECTION · STAMPED AUTOMOTIVE PARTS
                </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0, ease: EASE_CUBIC }}
                className="flex items-center gap-2 mb-4 sm:mb-5"
              >
                <Diamond className="w-3.5 h-3.5 text-[#1D4ED8] fill-[#1D4ED8]/20 shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs sm:text-[0.8125rem] font-semibold text-[#1D4ED8] tracking-wider uppercase">
                  AUTOMATED OPTICAL INSPECTION · STAMPED AUTOMOTIVE PARTS
                </span>
              </motion.div>
            )}

            {/* Headline: fluid clamp, 4 intentional lines, 3 colors, left-to-right wipe entrance starting at time 0 */}
            <h1 className="font-sans font-extrabold text-[clamp(2.5rem,4.6vw,5.5rem)] leading-[0.98] tracking-[-0.03em] flex flex-col items-start w-full">
              {HEADLINE_LINES.map((line, idx) => {
                if (prefersReducedMotion) {
                  return (
                    <span key={idx} className="block text-left w-full">
                      {line.content}
                    </span>
                  );
                }

                return (
                  <span
                    key={idx}
                    className="block overflow-hidden w-full text-left"
                  >
                    <motion.span
                      className="block text-left"
                      initial={{
                        clipPath: 'inset(0 100% 0 0)',
                        x: '-3rem',
                      }}
                      animate={{
                        clipPath: 'inset(0 0% 0 0)',
                        x: 0,
                      }}
                      transition={{
                        duration: 0.9,
                        delay: idx * 0.18,
                        ease: EASE_CUBIC,
                      }}
                    >
                      {line.content}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            {/* Paragraph below: fade up 0.6s starting at time 0 with no delay waiting for headline */}
            {prefersReducedMotion ? (
              <p className="text-base sm:text-[1.375rem] text-[#475569] max-w-[34rem] mt-6 sm:mt-7 leading-relaxed font-normal font-sans">
                Camera-based inspection that measures each defect and signals accept or reject.
              </p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0,
                  ease: EASE_CUBIC,
                }}
                className="text-base sm:text-[1.375rem] text-[#475569] max-w-[34rem] mt-6 sm:mt-7 leading-relaxed font-normal font-sans"
              >
                Camera-based inspection that measures each defect and signals accept or reject.
              </motion.p>
            )}

            {/* Buttons: fade up 0.6s starting at time 0 with no delay */}
            {isAuthenticated && (
              prefersReducedMotion ? (
                <div className="mt-8">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="rounded-[0.1875rem] font-sans text-xs font-semibold px-5"
                  >
                    <Link to="/app/live-inspection">
                      Open inspection console
                    </Link>
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0,
                    ease: EASE_CUBIC,
                  }}
                  className="mt-8"
                >
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="rounded-[0.1875rem] font-sans text-xs font-semibold px-5"
                  >
                    <Link to="/app/live-inspection">
                      Open inspection console
                    </Link>
                  </Button>
                </motion.div>
              )
            )}
          </div>

          {/* Right Column: Image slider with simultaneous wipe + slide entrance starting at time 0 */}
          <div className="w-full flex items-center justify-center overflow-hidden">
            {prefersReducedMotion ? (
              <HeroSlider />
            ) : (
              <div className="w-full overflow-hidden">
                <motion.div
                  initial={{
                    clipPath: 'inset(0 100% 0 0)',
                    x: '-2rem',
                  }}
                  animate={{
                    clipPath: 'inset(0 0% 0 0)',
                    x: 0,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0,
                    ease: EASE_CUBIC,
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <HeroSlider />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
