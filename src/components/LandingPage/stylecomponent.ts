import styled, { keyframes } from 'styled-components';

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
  --tf-bg-page: #111111;
  --tf-bg-surface: #282828;
  --tf-bg-soft: #282828;
  --tf-text-primary: #E0E0E0;
  --tf-text-secondary: #E0E0E0;
  --tf-text-muted: #999999;
  --tf-accent: #666666;
  --tf-accent-light: #888888;
  --tf-accent-hover: #555555;
  --tf-accent-secondary: #666666;
  --tf-primary: #000000;
  --tf-border-subtle: rgba(102, 102, 102, 0.3);
  --tf-border-medium: rgba(102, 102, 102, 0.5);
  --tf-border: rgba(102, 102, 102, 0.3);
  --tf-disabled: rgba(102, 102, 102, 0.4);
  --tf-focus-ring: #888888;
  --tf-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.5);
  --tf-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
  --tf-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.7);
  
  min-height: 100vh;
  background: transparent;
  color: var(--tf-text-primary);
  position: relative;
  z-index: 0;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 50% 30%, rgba(17, 17, 17, 0.4), transparent 60%),
      radial-gradient(ellipse at 80% 70%, rgba(17, 17, 17, 0.2), transparent 50%);
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
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transform: ${props => (props.$isVisible ? 'translateY(0)' : 'translateY(30px)')};
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  transition-delay: ${props => `${props.$delay || 0}s`};
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;

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
    content: '';
    position: absolute;
    top: 0;
    height: 160px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--tf-accent), transparent);
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
    content: '';
    position: absolute;
    top: 0;
    height: 160px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--tf-accent), transparent);
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
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    width: 160px;
    background: linear-gradient(to right, transparent, var(--tf-accent), transparent);
  }
`;

export const HeroContentNew = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
  padding: 2.5rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
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
  color: #ffffff;

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
  color: rgba(203, 213, 225, 0.9);
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
  background: rgba(102, 102, 102, 0.15);
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
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
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
  background: var(--tf-accent);
  color: var(--tf-text-primary);
  border: 1px solid var(--tf-accent);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-md);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
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
  background: transparent;
  color: var(--tf-text-primary);
  border: 1px solid var(--tf-border-medium);
  box-shadow: none;

  &:hover {
    background: rgba(102, 102, 102, 0.1);
    border-color: var(--tf-accent);
    box-shadow: var(--tf-shadow-sm);
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
  background: linear-gradient(135deg, var(--tf-bg-surface) 0%, rgba(102, 102, 102, 0.1) 100%);
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
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transform: ${props => (props.$isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)')};
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: ${props => `${props.$delay || 0}s`};

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
  color: var(--tf-text-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
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
    content: '';
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
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
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
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: var(--tf-shadow-sm);
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transform: ${props => (props.$isVisible ? 'translateY(0)' : 'translateY(20px)')};
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: ${props => `${props.$delay || 0}s`};

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--tf-shadow-md);
    border-color: var(--tf-accent);
    background: var(--tf-bg-surface);
  }
`;

export const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: ${float} 3s ease-in-out infinite;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--tf-text-primary);
  margin: 0 0 0.75rem 0;
`;

export const FeatureBody = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--tf-text-secondary);
  margin: 0;
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

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 102, 102, 0.05) 0%, transparent 70%);
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
  padding: 1rem 2.5rem;
  background: var(--tf-accent);
  color: var(--tf-text-primary);
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
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

// New minimal hero overlay layout
