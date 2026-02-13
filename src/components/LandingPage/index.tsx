import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as S from "./stylecomponent";
import { ButtonsContainer } from "./stylecomponent";

type LandingPageProps = {
  onRequestDemo: () => void;
  onViewSandbox: () => void;
  onSignIn: () => void;
};

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  delay?: number;
};

type AnimatedSectionProps = {
  children: React.ReactNode;
  delay?: number;
};

// Custom hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  return [ref, isVisible] as const;
}

// Animated section wrapper
function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <S.AnimatedSection ref={ref} $isVisible={isVisible} $delay={delay}>
      {children}
    </S.AnimatedSection>
  );
}

function AnimatedMetric({
  stat,
  label,
  sublabel,
  delay = 0,
}: {
  stat: string;
  label: string;
  sublabel?: string;
  delay?: number;
}) {
  const hasNumber = /^\d+(\.\d+)?$/.test(stat);
  const numericValue = hasNumber ? parseFloat(stat) : NaN;

  const [sectionRef, isVisible] = useScrollAnimation();
  const [count, setCount] = useState(hasNumber ? 0 : Number.NaN);

  useEffect(() => {
    if (!isVisible || !hasNumber) return;

    let startTime: number | null = null;
    const duration = 2000;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(numericValue * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, hasNumber, numericValue]);

  return (
    <S.MetricCard ref={sectionRef} $delay={delay} $isVisible={isVisible}>
      <S.MetricValue style={stat.includes('Sectors') ? { fontSize: '2.5rem' } : undefined}>
        {hasNumber ? `${count}` : stat}
      </S.MetricValue>
      <S.MetricLabel>{label}</S.MetricLabel>
      {sublabel && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-gray-500)',
          fontWeight: 500,
          marginTop: '0.25rem',
          textTransform: 'none',
          letterSpacing: 'normal'
        }}>
          {sublabel}
        </div>
      )}
    </S.MetricCard>
  );
}

function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <S.FeatureCard ref={ref} $isVisible={isVisible} $delay={delay}>
      <S.FeatureIcon>{icon}</S.FeatureIcon>
      <S.FeatureTitle>{title}</S.FeatureTitle>
      <S.FeatureBody>{description}</S.FeatureBody>
    </S.FeatureCard>
  );
}

function Hero({
  onPrimaryClick,
  onSecondaryClick,
  onSignIn,
}: {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onSignIn: () => void;
}) {
  const titleText =
    "Bharat Krishi Setu: AI-Driven Planning for Agriculture & Petroleum";
  const words = titleText.split(" ");

  return (
    <S.HeroSectionNew>
      <S.BorderLeft />
      <S.BorderRight />
      <S.BorderBottom />

      <S.HeroContentNew>
        <S.HeroBadge>
          <S.BadgeDot />
          National Data Intelligence Platform
        </S.HeroBadge>

        <S.HeroTitleNew>
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </S.HeroTitleNew>

        <S.HeroSubtitleNew
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          Transforming scattered government data across agriculture and petroleum into real-time insights,
          automated sourcing, and predictive analytics—replacing weeks of manual effort with seconds
          of intelligent decision-making
        </S.HeroSubtitleNew>

        <S.CTAGroupNew
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <S.ButtonPrimary type="button" onClick={onPrimaryClick}>
            Request Government Demo
          </S.ButtonPrimary>
          <S.ButtonSecondary type="button" onClick={onSecondaryClick}>
            Explore Platform
          </S.ButtonSecondary>
        </S.CTAGroupNew>

        <S.SignInRowNew
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
        >
          Already have access?{" "}
          <S.SignInLink type="button" onClick={onSignIn}>
            Sign in
          </S.SignInLink>
        </S.SignInRowNew>
      </S.HeroContentNew>
    </S.HeroSectionNew>
  );
}

function LandingPage({
  onRequestDemo,
  onViewSandbox,
  onSignIn,
}: LandingPageProps) {
  const metrics = [
    { stat: "$150B", label: "Annual Import Bill Tracked", sublabel: "Petroleum sector monitoring" },
    { stat: "95%", label: "Time Reduction", sublabel: "Weeks to minutes" },
    { stat: "10,000+", label: "Records Synced", sublabel: "Live government data" },
    { stat: "2 Sectors", label: "Unified Platform", sublabel: "Agriculture & Petroleum" },
  ];

  const problemStatements = [
    {
      title: "Agriculture: Manual Commodity Sourcing Crisis",
      icon: "🌾",
      description:
        "Government officers manually contact 30+ states to find surplus stock during shortages—a process that takes days or weeks while prices spike 300% and commodities rot in warehouses.",
    },
    {
      title: "Petroleum: $150B Import Bill With No Forecasting",
      icon: "⚡",
      description:
        "India's largest forex expenditure has zero unified tracking system for declining domestic production, refinery utilization, or demand-supply gaps—making critical energy security decisions reactive instead of proactive.",
    },
    {
      title: "Fragmented Data Across 10+ Portals",
      icon: "📊",
      description:
        "Critical government data exists in incompatible formats across scattered websites—months as strings vs integers, mixed units, different date formats—requiring manual cleanup before any analysis.",
    },
    {
      title: "No Transport Cost Intelligence",
      icon: "🚛",
      description:
        "Comparing railway freight vs road transport costs is done manually for every route with no automated tool to find the cheapest option, resulting in crores wasted annually on uninformed transport choices.",
    },
  ];

  const features = [
    {
      title: "Automated Commodity Sourcing",
      icon: "🔍",
      description:
        "Instantly identify which market yards across India have surplus stock for any commodity—eliminating weeks of manual calls and coordination across states.",
    },
    {
      title: "Rail vs Road Cost Comparator",
      icon: "🚂",
      description:
        "Automatically calculate and compare railway freight rates and road transport costs between any two points, finding the cheapest route in seconds instead of days.",
    },
    {
      title: "AI-Powered Price Prediction",
      icon: "🤖",
      description:
        "GPT-4o-mini analyzes historical commodity price trends to predict future prices 2-3 weeks in advance, enabling proactive intervention before market crises.",
    },
    {
      title: "Crude Production Forecaster",
      icon: "🛢️",
      description:
        "Track ONGC, OIL, and private company output trends and predict domestic crude production for the next 3 years to inform import planning and energy security strategies.",
    },
    {
      title: "Import Bill Forecasting",
      icon: "💰",
      description:
        "AI analyzes historical petroleum trade data to project India's oil import expenditure for the next 2 years, giving Finance Ministry actionable budget inputs.",
    },
    {
      title: "Trade Balance Dashboard",
      icon: "⚖️",
      description:
        "One-click view showing which petroleum products India is a net importer vs net exporter—revealing India imports 60% of LPG while exporting surplus diesel.",
    },
    {
      title: "AI Market Intelligence Briefings",
      icon: "📑",
      description:
        "Generate comprehensive strategic reports combining production, refinery, trade, and cost data—analysis that would take human analysts days to compile, delivered in seconds.",
    },
    {
      title: "Real-Time Market Monitoring",
      icon: "📈",
      description:
        "Live tracking of commodity prices across states with alerts for abnormal price spikes, enabling early intervention before shortages escalate into national crises.",
    },
    {
      title: "Refinery Utilization Tracking",
      icon: "🏭",
      description:
        "Monitor utilization patterns, seasonal trends, and capacity bottlenecks across 23+ Indian refineries in unified dashboard instead of separate siloed reports.",
    },
    {
      title: "Zero-Downtime Architecture",
      icon: "🔄",
      description:
        "Every AI endpoint has deterministic statistical fallback—when OpenAI is unavailable, platform switches to statistical models automatically ensuring government operations never stop.",
    },
    {
      title: "Idempotent Data Sync",
      icon: "🔁",
      description:
        "Run sync commands repeatedly with zero duplicates. Selective sync flags allow refreshing individual datasets without touching others—safe, granular data management.",
    },
    {
      title: "Scalable Sector-Agnostic Design",
      icon: "🧩",
      description:
        "Shared DataGovClient, OpenAIService, and API framework mean adding coal, power, or railways is plugging in new data sources—not rebuilding the entire platform.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Government Data",
      description:
        "Platform automatically syncs 10,000+ records from data.gov.in, IMD, Ministry of Petroleum APIs, normalizing inconsistent formats into clean, structured database.",
    },
    {
      number: "02",
      title: "AI-Powered Analysis",
      description:
        "GPT-4o-mini processes historical trends, identifies patterns, and generates price predictions, production forecasts, and strategic market intelligence briefings.",
    },
    {
      number: "03",
      title: "Actionable Intelligence Delivered",
      description:
        "Government officers receive ranked procurement options, transport cost comparisons, import bill projections, and trade balance insights—decisions made in minutes instead of weeks.",
    },
  ];

  const targetUsers = [
    {
      title: "Ministry of Agriculture",
      description: "Instant commodity sourcing, automated transport cost comparison, real-time price monitoring, AI-driven crop advisories for faster policy decisions",
    },
    {
      title: "Ministry of Petroleum & Natural Gas",
      description: "Unified crude production tracking, refinery monitoring, trade balance analysis, AI-powered import bill forecasting",
    },
    {
      title: "State Procurement Agencies",
      description: "Quickly locate surplus stock in other states, compare rail vs road freight costs, make procurement decisions in minutes",
    },
    {
      title: "Food Corporation of India (FCI)",
      description: "Data-driven grain movement planning, optimal route selection, demand-supply gap identification across regions",
    },
    {
      title: "NITI Aayog / Policy Think Tanks",
      description: "Cross-sector intelligence combining agriculture and energy data for national planning, budget allocation, strategic policy design",
    },
    {
      title: "Finance Ministry / RBI",
      description: "Petroleum import bill forecasting for forex reserve planning and current account deficit management",
    },
  ];

  const impactMetrics = [
    {
      stat: "Weeks→Minutes",
      label: "Sourcing Time Reduction",
      description: "Commodity procurement from 10-15 days down to under 5 minutes through automated surplus identification",
    },
    {
      stat: "Crores Saved",
      label: "Annual Transport Cost Savings",
      description: "Automated rail vs road comparison ensures government always picks cheapest route",
    },
    {
      stat: "2-3 Weeks",
      label: "Early Warning Window",
      description: "AI price prediction flags upcoming shortages before prices spike 200-300%",
    },
    {
      stat: "2 Years Ahead",
      label: "Import Bill Forecasting",
      description: "Predicting $150B oil import bill allows RBI and Finance Ministry to plan forex reserves strategically",
    },
  ];

  return (
    <>
      <S.Page>
        <S.Container>
          <Hero
            onPrimaryClick={onRequestDemo}
            onSecondaryClick={onViewSandbox}
            onSignIn={onSignIn}
          />

          <AnimatedSection delay={0.1}>
            <S.MetricsSection>
              {metrics.map((metric, index) => (
                <AnimatedMetric
                  key={metric.label}
                  stat={metric.stat}
                  label={metric.label}
                  sublabel={metric.sublabel}
                  delay={index * 0.1}
                />
              ))}
            </S.MetricsSection>
          </AnimatedSection>

          {/* Problem Statement Section */}
          <AnimatedSection delay={0.2}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>The Problem We Solve</S.SectionTitle>
                <S.SectionSubtitle>
                  India's government spends enormous time and manpower manually managing agriculture
                  and petroleum data—decisions that should take minutes currently take days or weeks
                </S.SectionSubtitle>
              </S.SectionHeader>
              <S.FeaturesGrid>
                {problemStatements.map((problem, index) => (
                  <FeatureCard
                    key={problem.title}
                    title={problem.title}
                    icon={problem.icon}
                    description={problem.description}
                    delay={index * 0.1}
                  />
                ))}
              </S.FeaturesGrid>
            </S.Section>
          </AnimatedSection>

          {/* How It Works */}
          <AnimatedSection delay={0.3}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>How It Works</S.SectionTitle>
                <S.SectionSubtitle>
                  Three-step process from scattered government data to intelligent decisions
                </S.SectionSubtitle>
              </S.SectionHeader>
              <S.StepsGrid>
                {steps.map((step, index) => (
                  <AnimatedSection key={step.number} delay={index * 0.15}>
                    <S.StepCard>
                      <S.StepNumber>{step.number}</S.StepNumber>
                      <S.StepTitle>{step.title}</S.StepTitle>
                      <S.StepBody>{step.description}</S.StepBody>
                    </S.StepCard>
                  </AnimatedSection>
                ))}
              </S.StepsGrid>
            </S.Section>
          </AnimatedSection>

          {/* Features Section */}
          <AnimatedSection delay={0.4}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>Powerful Platform Features</S.SectionTitle>
                <S.SectionSubtitle>
                  Comprehensive intelligence tools for both agriculture and petroleum sectors
                </S.SectionSubtitle>
              </S.SectionHeader>
              <S.FeaturesGrid>
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    icon={feature.icon}
                    description={feature.description}
                    delay={index * 0.08}
                  />
                ))}
              </S.FeaturesGrid>
            </S.Section>
          </AnimatedSection>

          {/* Target Users Section */}
          <AnimatedSection delay={0.5}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>Who Benefits</S.SectionTitle>
                <S.SectionSubtitle>
                  Designed for government ministries, state agencies, and policy organizations
                </S.SectionSubtitle>
              </S.SectionHeader>
              <S.FeaturesGrid>
                {targetUsers.map((user, index) => (
                  <AnimatedSection key={user.title} delay={index * 0.1}>
                    <S.FeatureCard $isVisible={true} $delay={0}>
                      <S.FeatureIcon>🏛️</S.FeatureIcon>
                      <S.FeatureTitle>{user.title}</S.FeatureTitle>
                      <S.FeatureBody>{user.description}</S.FeatureBody>
                    </S.FeatureCard>
                  </AnimatedSection>
                ))}
              </S.FeaturesGrid>
            </S.Section>
          </AnimatedSection>

          {/* Impact Metrics */}
          <AnimatedSection delay={0.6}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>Expected Impact</S.SectionTitle>
                <S.SectionSubtitle>
                  Measurable outcomes transforming India's governance efficiency
                </S.SectionSubtitle>
              </S.SectionHeader>
              <S.StepsGrid>
                {impactMetrics.map((impact, index) => (
                  <AnimatedSection key={impact.label} delay={index * 0.12}>
                    <S.StepCard>
                      <S.MetricValue style={{ fontSize: '2rem', color: 'var(--color-brand-primary)' }}>
                        {impact.stat}
                      </S.MetricValue>
                      <S.StepTitle>{impact.label}</S.StepTitle>
                      <S.StepBody>{impact.description}</S.StepBody>
                    </S.StepCard>
                  </AnimatedSection>
                ))}
              </S.StepsGrid>
            </S.Section>
          </AnimatedSection>

          {/* Final CTA */}
          <AnimatedSection delay={0.7}>
            <S.CTASection>
              <S.CTATitle>
                Ready to Transform Government Decision-Making?
              </S.CTATitle>
              <S.CTADescription>
                Join the national data intelligence revolution. Deploy Bharat Krishi Setu
                to cut costs, accelerate decisions, and enable data-driven governance across
                agriculture and petroleum sectors.
              </S.CTADescription>
              <ButtonsContainer>
                <S.CTAButton type="button" onClick={onRequestDemo}>
                  Request Government Pilot
                </S.CTAButton>
                <S.ButtonSecondary type="button" onClick={onViewSandbox}>
                  Explore Platform Demo
                </S.ButtonSecondary>
              </ButtonsContainer>
            </S.CTASection>
          </AnimatedSection>
        </S.Container>
      </S.Page>
    </>
  );
}

export default LandingPage;
