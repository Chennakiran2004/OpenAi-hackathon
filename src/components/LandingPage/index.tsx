import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as S from "./stylecomponent";
import Antigravity from "../Antigravity";

type LandingPageProps = {
  onRequestDemo: () => void;
  onViewSandbox: () => void;
  onSignIn: () => void;
};

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: string;
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
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
  delay = 0,
}: {
  stat: string;
  label: string;
  delay?: number;
}) {
  const numericValue = parseFloat(stat.replace(/[^0-9.]/g, ""));
  const hasNumber = !isNaN(numericValue);
  const suffix = stat.replace(/[0-9.]/g, "");

  const [sectionRef, isVisible] = useScrollAnimation();
  const [count, setCount] = useState(hasNumber ? 0 : stat);

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
      <S.MetricValue>{hasNumber ? `${count}${suffix}` : stat}</S.MetricValue>
      <S.MetricLabel>{label}</S.MetricLabel>
    </S.MetricCard>
  );
}

function FeatureCard({ title, description, delay = 0 }: FeatureCardProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <S.FeatureCard ref={ref} $isVisible={isVisible} $delay={delay}>
      <S.FeatureIcon>✨</S.FeatureIcon>
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
    "National Inter-State Agricultural Intelligence & Optimization Platform";
  const words = titleText.split(" ");

  return (
    <S.HeroSectionNew>
      <S.BorderLeft />
      <S.BorderRight />
      <S.BorderBottom />

      <S.HeroContentNew>
        <S.HeroBadge>
          <S.BadgeDot />
          Bharat Krishi Setu
        </S.HeroBadge>

        <S.HeroTitleNew>
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
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
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          AI-powered recommendations to help every state buy and sell crops
          smarter—cutting cost, delivery time, and carbon footprint.
        </S.HeroSubtitleNew>

        <S.CTAGroupNew
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <S.ButtonPrimary type="button" onClick={onPrimaryClick}>
            Request Demo
          </S.ButtonPrimary>
          <S.ButtonSecondary type="button" onClick={onSecondaryClick}>
            View Sandbox Data
          </S.ButtonSecondary>
        </S.CTAGroupNew>

        <S.SignInRowNew
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          Already have access?{" "}
          <S.SignInLink type="button" onClick={onSignIn}>
            Sign in
          </S.SignInLink>
        </S.SignInRowNew>

        {/* <S.HeroImageContainer
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <S.HeroImageWrapper>
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&h=600&fit=crop"
              alt="Inter-state agricultural logistics"
            />
          </S.HeroImageWrapper>
        </S.HeroImageContainer> */}
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
    { stat: "10-20%", label: "Procurement cost reduction target" },
    { stat: "<5s", label: "Recommendation SLA" },
    { stat: "29", label: "States covered" },
    { stat: "Carbon", label: "Carbon-aware routing built-in" },
  ];

  const features = [
    {
      title: "Optimization Engine",
      description:
        "Ranks source states by total cost, time, and carbon with configurable weights.",
    },
    {
      title: "Live Availability",
      description:
        "Ingests government crop yield & price feeds to keep decisions current.",
    },
    {
      title: "Impact Dashboard",
      description:
        "Savings, carbon reduction, and delivery time improvements for every decision.",
    },
    {
      title: "Alerts & Forecasts",
      description:
        "Shortage warnings, surplus redirection, and disaster signals for proactive action.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Data",
      description:
        "Sync state crop availability, prices, and logistics baselines.",
    },
    {
      number: "02",
      title: "Enter Demand",
      description:
        "Specify crop, required quantity, urgency, and delivery window.",
    },
    {
      number: "03",
      title: "Get Ranked Options",
      description:
        "See best cost, fastest, and lowest-carbon sourcing paths instantly.",
    },
  ];

  return (
    <S.Page>
      <S.AntigravityWrapper>
        <Antigravity
          count={100}
          magnetRadius={8}
          ringRadius={10}
          waveSpeed={0.2}
          waveAmplitude={0.2}
          particleSize={0.5}
          lerpSpeed={0.1}
          color="#666666"
          autoAnimate={false}
          particleVariance={1}
          rotationSpeed={0.4}
          depthFactor={0.4}
          pulseSpeed={3}
          particleShape="tetrahedron"
          fieldStrength={10}
        />
      </S.AntigravityWrapper>
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
                delay={index * 0.1}
              />
            ))}
          </S.MetricsSection>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <S.Section>
            <S.SectionHeader>
              <S.SectionTitle>How It Works</S.SectionTitle>
              <S.SectionSubtitle>
                Three steps to optimize inter-state crop sourcing
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

        <AnimatedSection delay={0.3}>
          <S.Section>
            <S.SectionHeader>
              <S.SectionTitle>Powerful Features</S.SectionTitle>
              <S.SectionSubtitle>
                Everything you need for smarter, faster, greener procurement
              </S.SectionSubtitle>
            </S.SectionHeader>
            <S.FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </S.FeaturesGrid>
          </S.Section>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <S.CTASection>
            <S.CTATitle>Ready to Optimize Inter-State Procurement?</S.CTATitle>
            <S.CTADescription>
              Pilot Bharat Krishi Setu to cut costs, speed deliveries, and
              shrink carbon emissions.
            </S.CTADescription>
            <S.CTAButton type="button" onClick={onRequestDemo}>
              Request Government Pilot
            </S.CTAButton>
            <S.ButtonSecondary
              type="button"
              style={{ marginTop: "0.75rem" }}
              onClick={onViewSandbox}
            >
              Explore Sandbox Data
            </S.ButtonSecondary>
          </S.CTASection>
        </AnimatedSection>
      </S.Container>
    </S.Page>
  );
}

export default LandingPage;
