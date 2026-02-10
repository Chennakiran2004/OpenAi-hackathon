import React from 'react';
import * as S from './stylecomponent';

type LandingPageProps = {
  onRecruiterSignUp: () => void;
  onStudentSignUp: () => void;
  onSignIn: () => void;
};

type FeatureCardProps = {
  title: string;
  description: string;
};

type SectionCTAProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <S.FeatureCard>
      <S.FeatureTitle>{title}</S.FeatureTitle>
      <S.FeatureBody>{description}</S.FeatureBody>
    </S.FeatureCard>
  );
}

function SectionCTA({ title, description, actionLabel, onAction }: SectionCTAProps) {
  return (
    <S.FinalCTA aria-labelledby="final-cta-title">
      <S.FinalTitle id="final-cta-title">{title}</S.FinalTitle>
      <S.FinalBody>{description}</S.FinalBody>
      <S.SpacerButton type="button" onClick={onAction}>
        {actionLabel}
      </S.SpacerButton>
    </S.FinalCTA>
  );
}

function Hero({ onPrimaryClick, onSecondaryClick, onSignIn }: { onPrimaryClick: () => void; onSecondaryClick: () => void; onSignIn: () => void }) {
  return (
    <S.HeroLayout aria-labelledby="hero-title">
      <S.HeroPanel>
        <S.Eyebrow>TalentForge AI</S.Eyebrow>
        <S.HeroTitle id="hero-title">Hire Smarter. Screen Faster. Stay Fair.</S.HeroTitle>
        <S.HeroSubtitle>
          TalentForge AI helps hiring teams rank candidates with explainable signals so decisions are fast, consistent, and easier to defend.
        </S.HeroSubtitle>

        <S.TrustList>
          <S.TrustItem>
            <S.Dot />
            <span>
              <S.TrustLabel>Speed:</S.TrustLabel> review qualified candidates in minutes, not days.
            </span>
          </S.TrustItem>
          <S.TrustItem>
            <S.Dot />
            <span>
              <S.TrustLabel>Explainability:</S.TrustLabel> clear score drivers for every ranked profile.
            </span>
          </S.TrustItem>
          <S.TrustItem>
            <S.Dot />
            <span>
              <S.TrustLabel>Fairness:</S.TrustLabel> blind-screening mode reduces identity-based bias.
            </span>
          </S.TrustItem>
        </S.TrustList>

        <S.CTAGroup>
          <S.ButtonPrimary type="button" onClick={onPrimaryClick}>
            Upload Resumes and Start Screening
          </S.ButtonPrimary>
          <S.ButtonSecondary type="button" onClick={onSecondaryClick}>
            Explore Candidate Experience
          </S.ButtonSecondary>
        </S.CTAGroup>

        <S.SignInRow>
          Already have an account?{' '}
          <S.SignInLink type="button" onClick={onSignIn}>
            Sign in
          </S.SignInLink>
        </S.SignInRow>
      </S.HeroPanel>

      <S.HeroVisual>
        <div>
          <S.VisualLabel>Trusted Hiring Outcomes</S.VisualLabel>
          <S.VisualTitle>From resume overload to confident shortlists</S.VisualTitle>
        </div>
        <S.VisualGrid>
          <S.VisualStat>
            <S.VisualValue>70%</S.VisualValue>
            <S.VisualMeta>faster first-round screening</S.VisualMeta>
          </S.VisualStat>
          <S.VisualStat>
            <S.VisualValue>80%+</S.VisualValue>
            <S.VisualMeta>shortlist precision in pilot roles</S.VisualMeta>
          </S.VisualStat>
          <S.VisualStat>
            <S.VisualValue>100%</S.VisualValue>
            <S.VisualMeta>transparent AI score rationale</S.VisualMeta>
          </S.VisualStat>
          <S.VisualStat>
            <S.VisualValue>500</S.VisualValue>
            <S.VisualMeta>resumes processed in a demo run</S.VisualMeta>
          </S.VisualStat>
        </S.VisualGrid>
      </S.HeroVisual>
    </S.HeroLayout>
  );
}

function LandingPage({ onRecruiterSignUp, onStudentSignUp, onSignIn }: LandingPageProps) {
  const metrics = [
    { stat: '70%', label: 'Reduction in screening time' },
    { stat: '500', label: 'Resumes processed in one run' },
    { stat: '80%+', label: 'Shortlist precision across hiring roles' },
    { stat: '100%', label: 'Explainable AI scoring visibility' }
  ];

  const painPoints = [
    'Too many resumes for lean recruiting teams',
    'Keyword-based ATS filters reject strong candidates',
    'Bias risk in name, college, or profile-based reviews',
    'Slow and inconsistent hiring cycles'
  ];

  const steps = [
    { title: 'Upload resumes', description: 'Drop ZIP folders, PDFs, or CSV exports directly from your ATS.' },
    { title: 'AI semantic matching', description: 'TalentForge scores role fit through skills and context, not simple keyword matching.' },
    { title: 'Transparent ranking', description: 'Review ranked candidates with clear reasoning, confidence levels, and skill gaps.' }
  ];

  return (
    <S.Page>
      <S.ResponsiveStyles>
        <S.Container>
          <Hero onPrimaryClick={onRecruiterSignUp} onSecondaryClick={onStudentSignUp} onSignIn={onSignIn} />

          <S.MetricsStrip as="section" aria-label="Social proof metrics">
            {metrics.map((metric) => (
              <S.MetricCard key={metric.label}>
                <S.MetricValue>{metric.stat}</S.MetricValue>
                <S.MetricLabel>{metric.label}</S.MetricLabel>
              </S.MetricCard>
            ))}
          </S.MetricsStrip>

          <S.Surface as="section" aria-labelledby="problem-section-title">
            <S.ProblemGrid>
              <article>
                <S.SectionTitle id="problem-section-title">Hiring teams are overloaded while top talent gets missed.</S.SectionTitle>
                <S.SectionBody>
                  Traditional screening workflows are slow, opaque, and inconsistent. TalentForge replaces black-box ranking with transparent decisions you can explain to
                  leadership and candidates.
                </S.SectionBody>
                <S.PainList>
                  {painPoints.map((point) => (
                    <S.PainItem key={point}>
                      <S.Dot />
                      <span>{point}</span>
                    </S.PainItem>
                  ))}
                </S.PainList>
              </article>

              <S.BeforeCard>
                <S.BeforeLabel>Before TalentForge</S.BeforeLabel>
                <S.BeforeStack>
                  <S.BeforeItem>
                    <S.BeforeItemTitle>2,400 resumes waiting</S.BeforeItemTitle>
                    <S.BeforeItemText>Manual review queue growing for 12 days</S.BeforeItemText>
                  </S.BeforeItem>
                  <S.BeforeItem>
                    <S.BeforeItemTitle>ATS keyword misses</S.BeforeItemTitle>
                    <S.BeforeItemText>Strong candidates dropped because of wording mismatch</S.BeforeItemText>
                  </S.BeforeItem>
                  <S.BeforeItem>
                    <S.BeforeItemTitle>Unclear decisions</S.BeforeItemTitle>
                    <S.BeforeItemText>Hiring panels cannot defend why candidates were rejected</S.BeforeItemText>
                  </S.BeforeItem>
                </S.BeforeStack>
              </S.BeforeCard>
            </S.ProblemGrid>
          </S.Surface>

          <S.Surface as="section" aria-labelledby="how-it-works-title">
            <S.SectionTitle id="how-it-works-title">How it works</S.SectionTitle>
            <S.StepsGrid>
              {steps.map((step, index) => (
                <S.StepCard key={step.title}>
                  <S.StepLabel>Step {index + 1}</S.StepLabel>
                  <S.StepTitle>{step.title}</S.StepTitle>
                  <S.StepBody>{step.description}</S.StepBody>
                </S.StepCard>
              ))}
            </S.StepsGrid>
          </S.Surface>

          <S.Surface as="section" aria-labelledby="feature-highlights-title">
            <S.SectionTitle id="feature-highlights-title">Feature highlights</S.SectionTitle>
            <S.FeaturesGrid>
              <FeatureCard title="Explainable AI scoring" description="Each score includes plain-language evidence for ranking decisions." />
              <FeatureCard title="Blind screening mode" description="Hide identity fields to reduce unconscious bias in early evaluation." />
              <FeatureCard title="Bulk resume processing" description="Screen from 100 to 10,000 resumes with stable throughput and quality." />
              <FeatureCard title="Export-ready outputs" description="Export ranked shortlists and score breakdowns for ATS workflows." />
            </S.FeaturesGrid>
          </S.Surface>

          <S.PersonaGrid as="section" aria-labelledby="persona-title">
            <S.VisuallyHidden id="persona-title">Platform outcomes by audience</S.VisuallyHidden>
            <S.RecruiterCard>
              <S.PersonaLabel>For Recruiters</S.PersonaLabel>
              <S.PersonaTitle>Save hours and defend every shortlist</S.PersonaTitle>
              <S.PersonaBody>Cut first-round screening by 70%, prioritize top-fit candidates, and provide transparent reasons to your team.</S.PersonaBody>
            </S.RecruiterCard>
            <S.CandidateCard>
              <S.PersonaLabel>For Candidates</S.PersonaLabel>
              <S.PersonaTitle>Get evaluated on skill and role fit</S.PersonaTitle>
              <S.PersonaBody>Blind screening enables fairer visibility while skill-gap insights help candidates improve over time.</S.PersonaBody>
            </S.CandidateCard>
          </S.PersonaGrid>

          <SectionCTA
            title="Fair hiring should not be a black box."
            description="Build faster, cleaner, and more defensible hiring pipelines with explainable AI that your team can trust."
            actionLabel="Start Screening Smarter"
            onAction={onRecruiterSignUp}
          />
        </S.Container>
      </S.ResponsiveStyles>
    </S.Page>
  );
}

export default LandingPage;
