import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RiSeedlingFill } from "react-icons/ri";
import * as S from "./stylecomponent";
import { ButtonsContainer } from "./stylecomponent";

type LandingPageProps = {
  onRequestDemo: () => void;
  onViewSandbox: () => void;
  onSignIn: () => void;
};

// India Flag SVG Component
const IndiaFlag = () => (
  <svg width="40" height="28" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Saffron stripe */}
    <rect width="60" height="13.33" fill="#FF9933" />
    {/* White stripe */}
    <rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
    {/* Green stripe */}
    <rect y="26.67" width="60" height="13.33" fill="#138808" />
    {/* Ashoka Chakra */}
    <circle cx="30" cy="20" r="5" fill="none" stroke="#000080" strokeWidth="0.5" />
    {/* Chakra spokes */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = 30 + 3 * Math.cos(angle);
      const y1 = 20 + 3 * Math.sin(angle);
      const x2 = 30 + 5 * Math.cos(angle);
      const y2 = 20 + 5 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.3" />;
    })}
  </svg>
);

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
    "Bharat Krishi Setu: AI-Driven Planning for Agriculture, Petroleum & Carbon Credit";
  const words = titleText.split(" ");

  return (
    <S.HeroSectionNew>
      <S.BorderLeft />
      <S.BorderRight />
      <S.BorderBottom />

      <S.HeroContentNew>
        {/* Logo */}
        <div className="flex flex-col items-center">
          <S.LogoContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <S.LogoIcon>
              <RiSeedlingFill />
            </S.LogoIcon>
          </S.LogoContainer>

          <S.HeroBadge>
            <S.BadgeDot />
            India's First National Data Intelligence Platform
          </S.HeroBadge>
        </div>
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
          Transforming scattered government data across agriculture, petroleum, and carbon compliance into
          real-time insights, automated workflows, and predictive analytics, replacing weeks of manual
          effort with seconds of decision-ready intelligence.
        </S.HeroSubtitleNew>


        <S.CTAGroupNew
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <S.ButtonPrimary type="button" onClick={onSecondaryClick}>
            Explore Platform
          </S.ButtonPrimary>
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
    { stat: "10,000+", label: "Records Synced", sublabel: "Govt datasets + compliance logs" },
    { stat: "3 Sectors", label: "Unified Platform", sublabel: "Agriculture • Petroleum • Carbon Credit" },
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
      title: "Carbon: Emissions Without Transparency",
      icon: "♻️",
      description:
        "Coal-based industries report emissions periodically with limited audit trails. State authorities lack a transparent system for caps, surplus/deficit tracking, and controlled intra-state carbon credit balancing.",
    },
  ];

  const carbonComplianceCards = [
    {
      title: "Problem Statement",
      icon: "🏭",
      description:
        "Emission data is centralized and fragmented. Industries report emissions manually or periodically with limited transparency and auditability. There is no state-bound digital infrastructure to track industry-wise coal emissions, allocate caps, and enable controlled intra-state credit balancing.",
    },
    {
      title: "Solution: Blockchain-Based State Carbon Compliance",
      icon: "⛓️",
      description:
        "Use real government coal consumption datasets to compute CO₂ using scientific emission factors. Allocate each industry a carbon cap within its state. Surplus credits trade only within the same state. Interstate trading is restricted to State Authority wallets. All transactions are stored on-chain for transparency.",
    },
    {
      title: "Controlled Credit Exchange",
      icon: "⚖️",
      description:
        "A tamper-proof, state-level compliance layer aligned with evolving carbon-market policies: clear audit trails, state-bound balancing, and regulator-controlled interstate actions.",
    },
  ];

  const carbonMethodologyCards = [
    {
      title: "IPCC (What it is)",
      icon: "🌍",
      description:
        "Intergovernmental Panel on Climate Change (IPCC) is a UN scientific body. It does not make laws; it publishes climate science, calculation guidelines, and standard emission factors used worldwide. India aligns national inventories with IPCC methodology.",
    },
    {
      title: "Emission Factor",
      icon: "🧪",
      description:
        "A scientific multiplier that estimates how much CO₂ is released when a fuel is burned. Using standard factors keeps calculations consistent, explainable, and auditable across industries and states.",
    },
    {
      title: "Why ~2.42 tCO₂ per ton of coal",
      icon: "⚗️",
      description:
        "From combustion chemistry and real-world coal characteristics. Pure carbon yields ~3.67 tCO₂ per ton carbon (44/12), but coal contains moisture and ash with lower calorific value. Practical factors fall ~2.2–2.5; this MVP uses an IPCC-aligned average of ~2.42 tCO₂/ton.",
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
      title: "State Carbon Cap & Credit Balancing",
      icon: "✅",
      description:
        "Allocate caps, compute emissions from government coal consumption data, and enable controlled intra-state credit balancing with blockchain-backed traceability and audit-ready records.",
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
      icon: "🌾",
      description: "Instant commodity sourcing, automated transport cost comparison, real-time price monitoring, AI-driven crop advisories for faster policy decisions",
    },
    {
      title: "Ministry of Petroleum & Natural Gas",
      icon: "⛽",
      description: "Unified crude production tracking, refinery monitoring, trade balance analysis, AI-powered import bill forecasting",
    },
    {
      title: "State Procurement Agencies",
      icon: "🏪",
      description: "Quickly locate surplus stock in other states, compare rail vs road freight costs, make procurement decisions in minutes",
    },
    {
      title: "Food Corporation of India (FCI)",
      icon: "🌽",
      description: "Data-driven grain movement planning, optimal route selection, demand-supply gap identification across regions",
    },
    {
      title: "NITI Aayog / Policy Think Tanks",
      icon: "💡",
      description: "Cross-sector intelligence combining agriculture and energy data for national planning, budget allocation, strategic policy design",
    },
    {
      title: "Finance Ministry / RBI",
      icon: "💵",
      description: "Petroleum import bill forecasting for forex reserve planning and current account deficit management",
    },
    {
      title: "State Authorities / SPCBs",
      icon: "🏛️",
      description: "State-bound carbon compliance dashboards, cap allocation, audit-ready emission records, and controlled trading oversight",
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

          {/* Carbon Credit Compliance Section */}
          <AnimatedSection delay={0.25}>
            <S.Section>
              <S.SectionHeader>
                <S.SectionTitle>
                  State-Bound Blockchain Carbon Compliance & Credit Exchange for Coal-Based Industries
                </S.SectionTitle>
                <S.SectionSubtitle>
                  A state-level, tamper-proof compliance layer for coal emissions: transparent tracking,
                  cap allocation, and controlled intra-state credit balancing.
                </S.SectionSubtitle>
              </S.SectionHeader>

              <S.FeaturesGrid>
                {carbonComplianceCards.map((card, index) => (
                  <FeatureCard
                    key={card.title}
                    title={card.title}
                    icon={card.icon}
                    description={card.description}
                    delay={index * 0.08}
                  />
                ))}
              </S.FeaturesGrid>

              <div style={{ height: "1.5rem" }} />

              <S.SectionHeader>
                <S.SectionTitle>Methodology (IPCC aligned)</S.SectionTitle>
                <S.SectionSubtitle>
                  Transparent calculations using standard emission factors and explainable chemistry.
                </S.SectionSubtitle>
              </S.SectionHeader>

              <S.FeaturesGrid>
                {carbonMethodologyCards.map((card, index) => (
                  <FeatureCard
                    key={card.title}
                    title={card.title}
                    icon={card.icon}
                    description={card.description}
                    delay={index * 0.08}
                  />
                ))}
              </S.FeaturesGrid>

              <p
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  color: "var(--color-gray-600)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                MVP uses a standardized IPCC-aligned average; production can configure emission factor by
                coal grade/state.
              </p>
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
                      <S.FeatureIcon>{user.icon}</S.FeatureIcon>
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
                <S.CTAButton type="button" onClick={onViewSandbox}>
                  Explore Platform
                </S.CTAButton>
              </ButtonsContainer>
            </S.CTASection>
          </AnimatedSection>

          {/* Footer */}
          <S.Footer>
            <S.FooterContent>
              <S.FooterBrand>
                <S.FooterLogo>
                  <IndiaFlag />
                </S.FooterLogo>
                <S.FooterTagline>
                  <S.FooterTaglineMain>Made in India, Made for India</S.FooterTaglineMain>
                  <S.FooterTaglineSub>Building Digital India through Innovation</S.FooterTaglineSub>
                </S.FooterTagline>
              </S.FooterBrand>
              <S.FooterDivider />
              <S.FooterCopyright>
                © 2026 Bharat National Intelligence Platform. Powered by Government of India.
              </S.FooterCopyright>
            </S.FooterContent>
          </S.Footer>
        </S.Container>
      </S.Page>
    </>
  );
}

export default LandingPage;
