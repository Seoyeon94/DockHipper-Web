const DOWNLOAD_URL = "https://github.com/Seoyeon94/DockHipper-Web/releases/download/v1.0.0/DockHipper-v1.0.0.zip";
const APP_VERSION = "1.0.0";
const FILE_SIZE = "62.8 MB";
const MIN_MACOS_VERSION = "macOS 13.0+";
const FEEDBACK_URL = "";
const FAQ_URL = "";
const PRIVACY_URL = "";

window.DOCKHIPPER_SITE_CONFIG = {
  download: {
    url: DOWNLOAD_URL,
    version: APP_VERSION,
    fileSize: FILE_SIZE,
    minMacOS: MIN_MACOS_VERSION,
  },

  links: {
    feedbackUrl: FEEDBACK_URL,
    faqUrl: FAQ_URL,
    privacyUrl: PRIVACY_URL,
  },

  tabs: {
    figure: {
      title: "Hipper Figure",
      subtitle: "좋아하는 캐릭터를 배열해서 나만의 Dock을 꾸며보세요",
      steps: [
        {
          number: "01",
          label: "Characters",
          title: "함께할 친구를 골라보세요.",
          body: "원하는 캐릭터를 체크하고,\n드래그해서 순서를 바꿀 수 있어요.",
          image: "./assets/images/ui/figure-popup.png",
          imageAlt: "DockHipper Figure settings popup screenshot.",
          imageKind: "figure-popup",
          highlight: { left: 5.1, top: 27.7, width: 85.7, height: 26.8 },
        },
        {
          number: "02",
          label: "Size",
          title: "Dock에 딱 맞는 크기로.",
          body: "슬라이더를 움직여\n피규어들의 크기를 조절해보세요.",
          image: "./assets/images/ui/figure-popup.png",
          imageAlt: "DockHipper Figure settings popup screenshot.",
          imageKind: "figure-popup",
          highlight: { left: 5.1, top: 58.8, width: 85.7, height: 7.3 },
        },
        {
          number: "03",
          label: "Position",
          title: "원하는 곳에 올려두세요.",
          body: "Dock Center로 가운데에 두거나,\nCustom으로 직접 위치를 정할 수 있어요.",
          image: "./assets/images/ui/figure-popup.png",
          imageAlt: "DockHipper Figure settings popup screenshot.",
          imageKind: "figure-popup",
          highlight: { left: 5.1, top: 70.4, width: 85.7, height: 18.9 },
        },
        {
          number: "04",
          label: "Startup",
          title: "Mac을 켜면, Hipper도 함께.",
          body: "로그인할 때 자동으로\nHipper가 시작되도록 설정할 수 있어요.",
          image: "./assets/images/ui/figure-popup.png",
          imageAlt: "DockHipper Figure settings popup screenshot.",
          imageKind: "figure-popup",
          highlight: { left: 5.1, top: 93.1, width: 43.3, height: 4.6 },
        },
      ],
    },

    timer: {
      title: "Hipper Timer",
      subtitle: "해야 할 일이 있다면, Hipper와 함께 집중해보세요",
      steps: [
        {
          number: "01",
          label: "Hours / Minutes",
          title: "얼마나 집중할까요?",
          body: "원하는 집중 시간을 설정해보세요.",
          image: "./assets/images/ui/timer-settings.png",
          imageAlt: "DockHipper Timer settings screenshot showing hours and minutes inputs.",
          imageKind: "tall",
          highlight: { left: 5.4, top: 40.8, width: 89.2, height: 11.4 },
        },
        {
          number: "02",
          label: "Start Timer",
          title: "Hipper와 함께 시작해요.",
          body: "시작 버튼을 누르면 3초 뒤\n타이머가 시작돼요.",
          image: "./assets/images/ui/timer-settings.png",
          imageAlt: "DockHipper Timer settings screenshot showing the start timer button.",
          imageKind: "tall",
          highlight: { left: 5.4, top: 55.0, width: 89.2, height: 7.0 },
        },
        {
          number: "03",
          label: "Timer 종료",
          title: "집중 완료!",
          body: "시간이 끝나면\nDock 위의 Hipper가 알려줄게요.",
          image: "./assets/images/ui/timer-complete-dock.png",
          imageAlt: "DockHipper timer complete message above the Dock.",
          imageKind: "timer-complete",
          highlight: { left: 63.5, top: 30.8, width: 15.7, height: 46.5 },
        },
      ],
    },
  },
};
