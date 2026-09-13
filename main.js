(function () {
  const config = window.DOCKHIPPER_SITE_CONFIG;

  if (!config) {
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    activeTab: "figure",
    activeStepByTab: {
      figure: 0,
      timer: 0,
    },
    ticking: false,
    descriptionTimer: null,
  };

  const elements = {
    featureScroll: $("#featureScroll"),
    featurePanel: $("#featurePanel"),
    featureTitle: $("#featureTitle"),
    featureSubtitle: $("#featureSubtitle"),
    stepNavigation: $("#stepNavigation"),
    screenshotFrame: $("#screenshotFrame"),
    featureImage: $("#featureImage"),
    highlightBox: $("#highlightBox"),
    descriptionCard: $("#descriptionCard"),
    descriptionNumber: $("#descriptionNumber"),
    descriptionLabel: $("#descriptionLabel"),
    descriptionTitle: $("#descriptionTitle"),
    descriptionBody: $("#descriptionBody"),
    tabButtons: $$("[data-tab]"),
    downloadLinks: $$("[data-download-link]"),
    feedbackLinks: $$("[data-feedback-link]"),
    faqLinks: $$("[data-faq-link]"),
    privacyLinks: $$("[data-privacy-link]"),
  };

  const currentTab = () => config.tabs[state.activeTab];
  const currentSteps = () => currentTab().steps;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setLinkTargets = () => {
    elements.downloadLinks.forEach((link) => {
      link.href = config.download.url;
    });

    elements.feedbackLinks.forEach((link) => {
      link.href = config.links.feedbackUrl || "mailto:your-email@example.com?subject=%5BDockHipper%20Feedback%5D";
    });

    elements.faqLinks.forEach((link) => {
      link.href = config.links.faqUrl || "#top";
    });

    elements.privacyLinks.forEach((link) => {
      link.href = config.links.privacyUrl || "#top";
    });
  };

  const preloadFeatureImages = () => {
    const sources = new Set();

    Object.values(config.tabs).forEach((tab) => {
      tab.steps.forEach((step) => sources.add(step.image));
    });

    sources.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  };

  const setScrollHeight = () => {
    if (!elements.featureScroll) {
      return;
    }

    const steps = currentSteps().length;
    const isDesktop = window.matchMedia("(min-width: 860px)").matches;
    const height = 940 + (steps - 1) * 360;
    elements.featureScroll.style.setProperty("--feature-scroll-height", isDesktop ? `${height}px` : "auto");
  };

  const renderStepNavigation = () => {
    const steps = currentSteps();

    elements.stepNavigation.replaceChildren(
      ...steps.map((step, index) => {
        const button = document.createElement("button");
        button.className = "step-link";
        button.type = "button";
        button.dataset.stepIndex = String(index);
        button.setAttribute("aria-label", `${step.number} ${step.label}`);
        button.innerHTML = `
          <span class="step-dot">${step.number}</span>
          <span class="step-label">${step.label}</span>
        `;
        button.addEventListener("click", () => goToStep(index));
        return button;
      }),
    );
  };

  const applyHighlight = (highlight) => {
    elements.highlightBox.style.setProperty("--highlight-left", `${highlight.left}%`);
    elements.highlightBox.style.setProperty("--highlight-top", `${highlight.top}%`);
    elements.highlightBox.style.setProperty("--highlight-width", `${highlight.width}%`);
    elements.highlightBox.style.setProperty("--highlight-height", `${highlight.height}%`);
  };

  const updateFeatureImage = (step, shouldAnimate) => {
    const nextSource = new URL(step.image, window.location.href).href;
    const currentSource = elements.featureImage.currentSrc || elements.featureImage.src;

    elements.featureImage.alt = step.imageAlt;
    elements.screenshotFrame.dataset.kind = step.imageKind;

    if (currentSource === nextSource) {
      return;
    }

    if (!shouldAnimate) {
      elements.featureImage.src = step.image;
      return;
    }

    elements.screenshotFrame.classList.add("is-image-switching");
    window.setTimeout(() => {
      elements.featureImage.src = step.image;
      window.setTimeout(() => {
        elements.screenshotFrame.classList.remove("is-image-switching");
      }, 80);
    }, 130);
  };

  const setDescription = (step, animated) => {
    const write = () => {
      elements.descriptionNumber.textContent = step.number;
      elements.descriptionLabel.textContent = step.label;
      elements.descriptionTitle.textContent = step.title;
      elements.descriptionBody.textContent = step.body;
      elements.descriptionCard.classList.add("is-visible");
    };

    clearTimeout(state.descriptionTimer);

    if (!animated) {
      write();
      return;
    }

    elements.descriptionCard.classList.remove("is-visible");
    state.descriptionTimer = window.setTimeout(write, 130);
  };

  const updateActiveStep = (index, options = {}) => {
    const steps = currentSteps();
    const nextIndex = clamp(index, 0, steps.length - 1);
    const step = steps[nextIndex];
    const previous = state.activeStepByTab[state.activeTab];
    const changed = previous !== nextIndex || options.force;

    state.activeStepByTab[state.activeTab] = nextIndex;

    $$(".step-link", elements.stepNavigation).forEach((button, buttonIndex) => {
      const isActive = buttonIndex === nextIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "step" : "false");
    });

    updateFeatureImage(step, changed && !options.instant);
    applyHighlight(step.highlight);
    setDescription(step, changed && !options.instant);
  };

  const renderTab = (tabName, options = {}) => {
    state.activeTab = tabName;
    const tab = currentTab();

    elements.tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    elements.featureTitle.textContent = tab.title;
    elements.featureSubtitle.textContent = tab.subtitle;
    renderStepNavigation();
    setScrollHeight();
    updateActiveStep(state.activeStepByTab[tabName], { force: true, instant: options.instant });
  };

  const switchTab = (tabName) => {
    if (tabName === state.activeTab || !config.tabs[tabName]) {
      return;
    }

    elements.featurePanel.classList.add("is-switching");
    window.setTimeout(() => {
      renderTab(tabName);
      elements.featurePanel.classList.remove("is-switching");
      updateStepFromScroll();
    }, 160);
  };

  const featureScrollRange = () => {
    const rect = elements.featureScroll.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const start = rect.top + scrollTop;
    const end = start + elements.featureScroll.offsetHeight - window.innerHeight;
    return { start, end };
  };

  const updateStepFromScroll = () => {
    if (!window.matchMedia("(min-width: 860px)").matches) {
      return;
    }

    const steps = currentSteps();
    const { start, end } = featureScrollRange();
    const range = Math.max(end - start, 1);
    const progress = clamp((window.scrollY - start) / range, 0, 0.999);
    const index = clamp(Math.floor(progress * steps.length), 0, steps.length - 1);

    updateActiveStep(index);
  };

  const requestScrollUpdate = () => {
    if (state.ticking) {
      return;
    }

    state.ticking = true;
    window.requestAnimationFrame(() => {
      updateStepFromScroll();
      state.ticking = false;
    });
  };

  const goToStep = (index) => {
    state.activeStepByTab[state.activeTab] = index;

    if (!window.matchMedia("(min-width: 860px)").matches) {
      updateActiveStep(index);
      elements.featurePanel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const steps = currentSteps();
    const { start, end } = featureScrollRange();
    const stepSize = steps.length > 1 ? (end - start) / steps.length : 0;
    const target = start + stepSize * index + 2;

    window.scrollTo({
      top: target,
      behavior: "smooth",
    });

    updateActiveStep(index);
  };

  const boot = () => {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get("tab");
    const initialStep = Number.parseInt(params.get("step") || "1", 10);

    if (initialTab && config.tabs[initialTab]) {
      state.activeTab = initialTab;
    }

    if (Number.isFinite(initialStep)) {
      state.activeStepByTab[state.activeTab] = clamp(initialStep - 1, 0, currentSteps().length - 1);
    }

    setLinkTargets();
    preloadFeatureImages();
    renderTab(state.activeTab, { instant: true });
    elements.tabButtons.forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.tab));
    });
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", () => {
      setScrollHeight();
      requestScrollUpdate();
    });
  };

  document.addEventListener("DOMContentLoaded", boot);
})();
