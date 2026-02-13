import styled, { keyframes } from "styled-components";

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Base page styles
export const Page = styled.div`
  --tf-bg-page: var(--color-brand-light);
  --tf-bg-surface: #ffffff;
  --tf-bg-soft: var(--color-primary-50);
  --tf-text-primary: var(--color-gray-900);
  --tf-text-secondary: var(--color-gray-600);
  --tf-text-muted: var(--color-gray-500);
  --tf-accent: var(--color-brand-primary);
  --tf-accent-light: var(--color-brand-accent);
  --tf-accent-hover: var(--color-primary-700);
  --tf-accent-secondary: var(--color-brand-accent);
  --tf-primary: var(--color-brand-primary);
  --tf-border-subtle: var(--color-gray-200);
  --tf-border-medium: var(--color-gray-300);
  --tf-border: var(--color-gray-200);
  --tf-disabled: var(--color-gray-300);
  --tf-focus-ring: var(--color-brand-accent);
  --tf-shadow-sm: var(--shadow-sm);
  --tf-shadow-md: var(--shadow-md);
  --tf-shadow-lg: var(--shadow-lg);

  min-height: 100vh;
  background:
    radial-gradient(circle at 0% 0%, rgba(43, 182, 115, 0.1), transparent 38%),
    radial-gradient(
      circle at 100% 10%,
      rgba(31, 122, 77, 0.08),
      transparent 32%
    ),
    var(--tf-bg-page);
  color: var(--tf-text-primary);
  position: relative;
  z-index: 0;
  overflow-x: hidden;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        ellipse at 50% 30%,
        rgba(43, 182, 115, 0.06),
        transparent 60%
      ),
      radial-gradient(
        ellipse at 80% 70%,
        rgba(31, 122, 77, 0.04),
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }
`;

export const AntigravityWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;

  & > * {
    width: 100%;
    height: 100%;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

// Animated section wrapper
type AnimatedSectionProps = {
  $isVisible: boolean;
  $delay?: number;
};

export const AnimatedSection = styled.div<AnimatedSectionProps>`
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.$isVisible ? "translateY(0)" : "translateY(40px)"};
  transition:
    opacity 1s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${(props) => `${props.$delay || 0}s`};
  will-change: opacity, transform;
`;

// Hero Section
export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 6rem;
  min-height: 70vh;
  padding: 2rem 0;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
    min-height: auto;
  }
`;

// New Hero Section with Border Decorations
export const HeroSectionNew = styled.section`
  position: relative;
  max-width: 1280px;
  margin: 2.5rem auto 6rem;
  margin-top:0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin: 1.5rem auto 4rem;
  }
`;

export const BorderLeft = styled.div`
  position: absolute;
  inset-y: 0;
  left: 0;
  height: 100%;
  width: 1px;
  background: var(--tf-border-subtle);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 160px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--tf-accent),
      transparent
    );
  }
`;

export const BorderRight = styled.div`
  position: absolute;
  inset-y: 0;
  right: 0;
  height: 100%;
  width: 1px;
  background: var(--tf-border-subtle);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 160px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--tf-accent),
      transparent
    );
  }
`;

export const BorderBottom = styled.div`
  position: absolute;
  inset-x: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  background: var(--tf-border-subtle);

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    width: 160px;
    background: linear-gradient(
      to right,
      transparent,
      var(--tf-accent),
      transparent
    );
  }
`;

export const HeroContentNew = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
  padding-bottom: 2.5rem;

  @media (max-width: 768px) {
    padding-bottom: 1.5rem;
  }
`;

// Logo Styles
export const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
`;

export const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-brand-primary),
    var(--color-brand-accent)
  );
  border-radius: 20px;
  box-shadow: 
    0 10px 25px rgba(31, 122, 77, 0.3),
    0 4px 10px rgba(43, 182, 115, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    color: white;
    font-size: 3rem;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 15px 35px rgba(31, 122, 77, 0.4),
      0 6px 15px rgba(43, 182, 115, 0.3);
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    
    svg {
      font-size: 2.5rem;
    }
  }
`;

export const HeroTitleNew = styled.h1`
  position: relative;
  z-index: 10;
  max-width: 1024px;
  margin: 0 auto 1.5rem;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--tf-text-primary);

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
  }
`;

export const HeroSubtitleNew = styled.p`
  position: relative;
  z-index: 10;
  max-width: 672px;
  margin: 0 auto 2rem;
  padding: 1rem 0;
  text-align: center;
  font-size: 1.125rem;
  line-height: 1.7;
  font-weight: 400;
  color: var(--tf-text-secondary);
`;

export const CTAGroupNew = styled.div`
  position: relative;
  z-index: 10;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const SignInRowNew = styled.p`
  position: relative;
  z-index: 10;
  color: var(--tf-text-muted);
  font-size: 0.9375rem;
  margin: 1.5rem 0 0;
  text-align: center;
`;

export const HeroImageContainer = styled.div`
  position: relative;
  z-index: 10;
  margin-top: 5rem;
  border-radius: 24px;
  border: 1px solid var(--tf-border-subtle);
  background: var(--tf-bg-surface);
  padding: 1rem;
  box-shadow: var(--tf-shadow-md);

  @media (max-width: 768px) {
    margin-top: 3rem;
    padding: 0.75rem;
  }
`;

export const HeroImageWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--tf-border-subtle);

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    aspect-ratio: 16 / 9;
  }
`;

export const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--tf-bg-soft);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tf-accent);
  margin-bottom: 2rem;
`;

export const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tf-accent-light);
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--tf-text-primary);
  margin: 0 0 1.5rem 0;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

export const HeroTitleAccent = styled.span`
  color: var(--tf-accent);
`;

export const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--tf-text-secondary);
  margin: 0 0 2.5rem 0;
  max-width: 540px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeroStatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--tf-primary);
  line-height: 1;
  font-family:
    "JetBrains Mono", "Fira Code", "Consolas", "Monaco", "Courier New",
    monospace;
  font-feature-settings:
    "liga" 1,
    "calt" 1;
`;

export const HeroStatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-top: 0.25rem;
`;

export const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out 0.8s both;
`;

export const ButtonPrimary = styled.button`
  padding: 0.875rem 2rem;
  min-height: 52px;
  background: var(--tf-accent);
  color: #ffffff;
  border: 1px solid var(--tf-accent);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-md);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--tf-shadow-lg);
    background: var(--tf-accent-hover);
    border-color: var(--tf-accent-hover);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--tf-focus-ring);
    outline-offset: 2px;
  }

  &:disabled {
    background: var(--tf-disabled);
    color: var(--tf-text-muted);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ButtonSecondary = styled(ButtonPrimary)`
  background: var(--tf-accent-light);
  color: #ffffff;
  border: 1px solid var(--tf-accent-light);
  box-shadow: var(--tf-shadow-sm);

  &:hover {
    background: var(--tf-accent);
    border-color: var(--tf-accent);
    box-shadow: var(--tf-shadow-md);
  }
`;

export const SignInRow = styled.p`
  color: var(--tf-text-muted);
  font-size: 0.9375rem;
  margin: 0;
  animation: ${fadeIn} 0.8s ease-out 1s both;
`;

export const SignInLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: var(--tf-accent);
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--tf-accent-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--tf-focus-ring);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const HeroVisual = styled.div`
  position: relative;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  animation: ${fadeIn} 1s ease-out 0.4s both;

  @media (max-width: 968px) {
    height: 400px;
  }
`;

export const VisualGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--tf-bg-surface) 0%,
    rgba(43, 182, 115, 0.12) 100%
  );
  background-size: 200% 200%;
  animation: ${gradientShift} 8s ease infinite;
`;

export const VisualContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  text-align: center;
  color: var(--tf-text-primary);
`;

export const VisualTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  animation: ${float} 3s ease-in-out infinite;
`;

export const VisualSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
`;

// Metrics Section
export const MetricsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 6rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

type MetricCardProps = {
  $isVisible: boolean;
  $delay?: number;
};

export const MetricCard = styled.article<MetricCardProps>`
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-sm);
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.$isVisible
      ? "translateY(0) scale(1)"
      : "translateY(20px) scale(0.95)"};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  transition-delay: ${(props) => `${props.$delay || 0}s`};

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--tf-shadow-md);
    border-color: var(--tf-accent);
    background: var(--tf-bg-surface);
  }
`;

export const MetricValue = styled.div`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--tf-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family:
    "JetBrains Mono", "Fira Code", "Consolas", "Monaco", "Courier New",
    monospace;
  font-feature-settings:
    "liga" 1,
    "calt" 1;
`;

export const MetricLabel = styled.p`
  font-size: 0.9375rem;
  color: var(--tf-text-muted);
  margin: 0;
  line-height: 1.5;
`;

// Section Styles
export const Section = styled.section`
  margin-bottom: 6rem;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--tf-text-primary);
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: var(--tf-text-secondary);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

// Steps Grid
export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const StepCard = styled.article`
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-sm);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--tf-accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--tf-shadow-lg);
    border-color: var(--tf-accent);
    background: var(--tf-bg-surface);

    &::before {
      transform: scaleX(1);
    }
  }
`;

export const StepNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: var(--tf-accent);
  opacity: 0.2;
  line-height: 1;
  margin-bottom: 1rem;
  font-family:
    "JetBrains Mono", "Fira Code", "Consolas", "Monaco", "Courier New",
    monospace;
  font-feature-settings:
    "liga" 1,
    "calt" 1;
`;

export const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--tf-text-primary);
  margin: 0 0 1rem 0;
`;

export const StepBody = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--tf-text-secondary);
  margin: 0;
`;

// Features Grid
export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

type FeatureCardProps = {
  $isVisible: boolean;
  $delay?: number;
};

export const FeatureCard = styled.article<FeatureCardProps>`
  position: relative;
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.$isVisible ? "translateY(0)" : "translateY(30px)"};
  transition:
    opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  transition-delay: ${(props) => `${props.$delay || 0}s`};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--color-brand-primary),
      var(--color-brand-accent)
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(31, 122, 77, 0.15);
    border-color: var(--color-brand-accent);
    background: linear-gradient(
      135deg,
      var(--tf-bg-surface) 0%,
      rgba(43, 182, 115, 0.02) 100%
    );

    &::before {
      transform: scaleX(1);
    }
  }
`;

export const FeatureIcon = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(43, 182, 115, 0.1),
    rgba(31, 122, 77, 0.05)
  );
  border: 2px solid rgba(43, 182, 115, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    background: linear-gradient(
      135deg,
      var(--color-brand-accent),
      var(--color-brand-primary)
    );
    border-color: var(--color-brand-accent);
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 16px rgba(43, 182, 115, 0.3);
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--tf-text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: var(--color-brand-primary);
  }
`;

export const FeatureBody = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--tf-text-secondary);
  margin: 0;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: var(--tf-text-primary);
  }
`;

// CTA Section
export const CTASection = styled.section`
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 24px;
  padding: 4rem 3rem;
  text-align: center;
  color: var(--tf-text-primary);
  margin-bottom: 4rem;
  position: relative;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(43, 182, 115, 0.08) 0%,
      transparent 70%
    );
    animation: ${float} 6s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

export const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  position: relative;
  z-index: 1;
`;

export const CTADescription = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
`;

export const CTAButton = styled.button`
  padding: 0.875rem 2rem;
  min-height: 52px;
  background: var(--tf-accent);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-md);
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--tf-shadow-lg);
    background: var(--tf-accent-hover);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid var(--tf-focus-ring);
    outline-offset: 2px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

// Footer Styles
export const Footer = styled.footer`
  margin-top: 6rem;
  padding: 3rem 0 2rem;
  border-top: 1px solid var(--tf-border-subtle);
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--tf-bg-soft) 100%
  );
`;

export const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const FooterLogo = styled.div`
  font-size: 4rem;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(43, 182, 115, 0.2));
  animation: ${float} 6s ease-in-out infinite;
`;

export const FooterTagline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FooterTaglineMain = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    var(--color-brand-primary),
    var(--color-brand-accent),
    #FF9933,
    #138808
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 5s ease infinite;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const FooterTaglineSub = styled.div`
  font-size: 0.9375rem;
  color: var(--tf-text-secondary);
  font-weight: 500;
`;

export const FooterDivider = styled.div`
  height: 1px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(
    90deg,
    transparent,
    var(--tf-border-medium),
    transparent
  );
`;

export const FooterCopyright = styled.div`
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  font-weight: 400;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;
