import styled from 'styled-components';

export const Page = styled.div`
  --tf-bg-page: #f5f7fb;
  --tf-bg-surface: #ffffff;
  --tf-bg-soft: #f8fbff;
  --tf-text-primary: #122137;
  --tf-text-secondary: #405266;
  --tf-text-muted: #5f7287;
  --tf-border-subtle: rgba(18, 33, 55, 0.12);
  --tf-shadow-card: 0 18px 36px rgba(12, 25, 44, 0.08);
  --tf-shadow-hover: 0 22px 40px rgba(12, 25, 44, 0.12);
  --tf-accent: #0b6b63;
  --tf-trust: #132748;
  color: var(--tf-text-primary);
  background:
    radial-gradient(circle at 5% 5%, rgba(11, 107, 99, 0.1), transparent 36%),
    radial-gradient(circle at 90% 18%, rgba(35, 84, 160, 0.08), transparent 42%),
    var(--tf-bg-page);
`;

export const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
`;

export const Surface = styled.section`
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 16px;
  box-shadow: var(--tf-shadow-card);
  padding: 1.4rem;
`;

export const HeroLayout = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1rem;
`;

export const HeroPanel = styled.article`
  background: var(--tf-bg-surface);
  border: 1px solid var(--tf-border-subtle);
  border-radius: 16px;
  box-shadow: var(--tf-shadow-card);
  padding: 1.55rem;
`;

export const HeroVisual = styled(HeroPanel)`
  background: linear-gradient(160deg, #132748, #204170);
  color: #ecf7ff;
  border-color: rgba(236, 247, 255, 0.16);
  display: grid;
  align-content: space-between;
  gap: 1rem;
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: var(--tf-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.76rem;
  font-weight: 800;
`;

export const HeroTitle = styled.h1`
  margin: 0.65rem 0 0;
  color: var(--tf-trust);
  font-size: clamp(2rem, 4.6vw, 3.35rem);
  letter-spacing: -0.02em;
  line-height: 1.06;
`;

export const HeroSubtitle = styled.p`
  margin: 0.95rem 0 0;
  color: var(--tf-text-secondary);
  line-height: 1.65;
  font-size: 0.98rem;
  max-width: 62ch;
`;

export const TrustList = styled.ul`
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.6rem;
`;

export const TrustItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: var(--tf-text-secondary);
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #11b491;
  margin-top: 0.45rem;
  flex-shrink: 0;
`;

export const TrustLabel = styled.strong`
  color: var(--tf-text-primary);
`;

export const CTAGroup = styled.div`
  margin-top: 1.25rem;
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

export const ButtonPrimary = styled.button`
  min-height: 44px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: var(--tf-trust);
  color: #f3f8ff;
  padding: 0.66rem 1rem;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;

  &:hover {
    background: #0f2240;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 34, 64, 0.25);
  }

  &:focus-visible {
    outline: 2px solid #11b491;
    outline-offset: 2px;
  }
`;

export const ButtonSecondary = styled(ButtonPrimary)`
  background: transparent;
  color: var(--tf-accent);
  border-color: rgba(11, 107, 99, 0.35);
  box-shadow: none;

  &:hover {
    background: rgba(11, 107, 99, 0.08);
    transform: translateY(-1px);
    box-shadow: none;
  }
`;

export const SignInRow = styled.p`
  margin: 1rem 0 0;
  color: var(--tf-text-muted);
`;

export const SignInLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: var(--tf-accent);
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #11b491;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const VisualLabel = styled.p`
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(236, 247, 255, 0.78);
  font-weight: 700;
`;

export const VisualTitle = styled.h2`
  margin: 0.4rem 0 0;
  color: #f8fcff;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  line-height: 1.2;
`;

export const VisualGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
`;

export const VisualStat = styled.article`
  border: 1px solid rgba(236, 247, 255, 0.2);
  border-radius: 11px;
  padding: 0.75rem;
  background: rgba(236, 247, 255, 0.08);
`;

export const VisualValue = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const VisualMeta = styled.p`
  margin: 0.25rem 0 0;
  color: rgba(236, 247, 255, 0.85);
  font-size: 0.82rem;
  line-height: 1.4;
`;

export const MetricsStrip = styled(Surface)`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.7rem;
`;

export const MetricCard = styled.article`
  border-radius: 11px;
  padding: 0.75rem;
  border: 1px solid var(--tf-border-subtle);
  background: var(--tf-bg-soft);
`;

export const MetricValue = styled.p`
  margin: 0;
  color: var(--tf-trust);
  font-weight: 800;
  font-size: clamp(1.45rem, 2.7vw, 2.1rem);
  letter-spacing: -0.02em;
`;

export const MetricLabel = styled.p`
  margin: 0.28rem 0 0;
  color: var(--tf-text-muted);
  font-size: 0.88rem;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--tf-trust);
  font-size: clamp(1.25rem, 2.5vw, 1.72rem);
  letter-spacing: -0.01em;
`;

export const SectionBody = styled.p`
  margin: 0.62rem 0 0;
  color: var(--tf-text-secondary);
  line-height: 1.62;
`;

export const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const PainList = styled.ul`
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.56rem;
`;

export const PainItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: var(--tf-text-secondary);
`;

export const BeforeCard = styled.article`
  border: 1px solid var(--tf-border-subtle);
  border-radius: 12px;
  background: linear-gradient(170deg, #f7fbff, #f5fbf8);
  padding: 1rem;
`;

export const BeforeLabel = styled.p`
  margin: 0;
  color: var(--tf-trust);
  font-weight: 800;
`;

export const BeforeStack = styled.div`
  margin-top: 0.75rem;
  display: grid;
  gap: 0.6rem;
`;

export const BeforeItem = styled.div`
  border: 1px solid var(--tf-border-subtle);
  border-radius: 10px;
  background: #ffffff;
  padding: 0.7rem;
`;

export const BeforeItemTitle = styled.p`
  margin: 0;
  color: var(--tf-text-primary);
  font-weight: 700;
`;

export const BeforeItemText = styled.p`
  margin: 0.26rem 0 0;
  color: var(--tf-text-muted);
  font-size: 0.88rem;
`;

export const StepsGrid = styled.div`
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
`;

export const StepCard = styled.article`
  border: 1px solid var(--tf-border-subtle);
  border-radius: 11px;
  background: var(--tf-bg-soft);
  padding: 0.88rem;
`;

export const StepLabel = styled.p`
  margin: 0;
  color: var(--tf-accent);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
`;

export const StepTitle = styled.h3`
  margin: 0.5rem 0 0;
  color: var(--tf-text-primary);
  font-size: 1rem;
`;

export const StepBody = styled.p`
  margin: 0.42rem 0 0;
  color: var(--tf-text-muted);
  line-height: 1.55;
`;

export const FeaturesGrid = styled.div`
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

export const FeatureCard = styled.article`
  border: 1px solid var(--tf-border-subtle);
  border-radius: 12px;
  background: var(--tf-bg-soft);
  padding: 0.9rem;
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--tf-shadow-hover);
  }
`;

export const FeatureTitle = styled.h3`
  margin: 0;
  color: var(--tf-text-primary);
  font-size: 1rem;
`;

export const FeatureBody = styled.p`
  margin: 0.45rem 0 0;
  color: var(--tf-text-muted);
  line-height: 1.55;
  font-size: 0.9rem;
`;

export const PersonaGrid = styled(Surface)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
`;

const PersonaCardBase = styled.article`
  border: 1px solid var(--tf-border-subtle);
  border-radius: 12px;
  padding: 0.95rem;
`;

export const RecruiterCard = styled(PersonaCardBase)`
  background: #f8fafc;
`;

export const CandidateCard = styled(PersonaCardBase)`
  background: #f0fdf8;
`;

export const PersonaLabel = styled.p`
  margin: 0;
  color: var(--tf-accent);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const PersonaTitle = styled.h3`
  margin: 0.45rem 0 0;
  color: var(--tf-text-primary);
  font-size: 1.05rem;
`;

export const PersonaBody = styled.p`
  margin: 0.45rem 0 0;
  color: var(--tf-text-secondary);
  line-height: 1.58;
`;

export const FinalCTA = styled(Surface)`
  text-align: center;
`;

export const FinalTitle = styled.h2`
  margin: 0;
  color: var(--tf-trust);
  font-size: clamp(1.4rem, 2.8vw, 2rem);
`;

export const FinalBody = styled.p`
  margin: 0.56rem auto 0;
  max-width: 66ch;
  color: var(--tf-text-muted);
  line-height: 1.6;
`;

export const VisuallyHidden = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const SpacerButton = styled(ButtonPrimary)`
  margin-top: 1.1rem;
`;

export const ResponsiveStyles = styled.div`
  @media (max-width: 1024px) {
    ${HeroLayout} {
      grid-template-columns: 1fr;
    }

    ${MetricsStrip} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${ProblemGrid},
    ${StepsGrid},
    ${FeaturesGrid},
    ${PersonaGrid},
    ${VisualGrid} {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    ${Container} {
      padding: 1rem;
    }

    ${HeroPanel},
    ${Surface} {
      padding: 1.15rem;
    }

    ${MetricsStrip} {
      grid-template-columns: 1fr;
    }
  }
`;
