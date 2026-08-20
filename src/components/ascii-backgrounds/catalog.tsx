"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type PresetModule = { default: ComponentType };
type AsciiBackgroundPreset = {
  id: string;
  name: string;
  Component: ComponentType;
  preload: () => Promise<PresetModule>;
};

const load01 = () => import("./presets/01-tropical-ascii-cam");
const Preset01 = dynamic(load01, { ssr: false });
const load02 = () => import("./presets/04-ascii-tunnel-3");
const Preset02 = dynamic(load02, { ssr: false });
const load03 = () => import("./presets/08-ascii-peaks");
const Preset03 = dynamic(load03, { ssr: false });
const load04 = () => import("./presets/06-ascii-tunnel-5");
const Preset04 = dynamic(load04, { ssr: false });
const load05 = () => import("./presets/02-ascii-tunnel-1");
const Preset05 = dynamic(load05, { ssr: false });
const load06 = () => import("./presets/03-ascii-tunnel-2");
const Preset06 = dynamic(load06, { ssr: false });
const load07 = () => import("./presets/07-ascii-tunnel-6");
const Preset07 = dynamic(load07, { ssr: false });
const load08 = () => import("./presets/05-ascii-tunnel-4");
const Preset08 = dynamic(load08, { ssr: false });
const load09 = () => import("./presets/09-ascii-wave-1");
const Preset09 = dynamic(load09, { ssr: false });
const load10 = () => import("./presets/11-ascii-wave-3");
const Preset10 = dynamic(load10, { ssr: false });
const load11 = () => import("./presets/14-bad-signal-2");
const Preset11 = dynamic(load11, { ssr: false });
const load12 = () => import("./presets/18-realigning-3");
const Preset12 = dynamic(load12, { ssr: false });
const load13 = () => import("./presets/12-ascii-wave-4");
const Preset13 = dynamic(load13, { ssr: false });
const load14 = () => import("./presets/20-realigning-5");
const Preset14 = dynamic(load14, { ssr: false });
const load15 = () => import("./presets/16-realigning-1");
const Preset15 = dynamic(load15, { ssr: false });
const load16 = () => import("./presets/10-ascii-wave-2");
const Preset16 = dynamic(load16, { ssr: false });
const load17 = () => import("./presets/22-container-ship");
const Preset17 = dynamic(load17, { ssr: false });
const load18 = () => import("./presets/23-static-noise-1");
const Preset18 = dynamic(load18, { ssr: false });
const load19 = () => import("./presets/19-realigning-4");
const Preset19 = dynamic(load19, { ssr: false });
const load20 = () => import("./presets/25-arrow-skies-2");
const Preset20 = dynamic(load20, { ssr: false });
const load21 = () => import("./presets/17-realigning-2");
const Preset21 = dynamic(load21, { ssr: false });
const load22 = () => import("./presets/13-bad-signal-1");
const Preset22 = dynamic(load22, { ssr: false });
const load23 = () => import("./presets/26-free-stars-and-stripes-1");
const Preset23 = dynamic(load23, { ssr: false });
const load24 = () => import("./presets/27-free-stars-and-stripes-2");
const Preset24 = dynamic(load24, { ssr: false });
const load25 = () => import("./presets/28-pistons-1");
const Preset25 = dynamic(load25, { ssr: false });
const load26 = () => import("./presets/29-photocopied-7");
const Preset26 = dynamic(load26, { ssr: false });
const load27 = () => import("./presets/30-pistons-4");
const Preset27 = dynamic(load27, { ssr: false });
const load28 = () => import("./presets/31-matrix-rain");
const Preset28 = dynamic(load28, { ssr: false });
const load29 = () => import("./presets/15-bad-signal-3");
const Preset29 = dynamic(load29, { ssr: false });
const load30 = () => import("./presets/32-enter-the-matrix-2");
const Preset30 = dynamic(load30, { ssr: false });
const load31 = () => import("./presets/33-enter-the-matrix-3");
const Preset31 = dynamic(load31, { ssr: false });
const load32 = () => import("./presets/34-free-arrow-grid-1");
const Preset32 = dynamic(load32, { ssr: false });
const load33 = () => import("./presets/24-static-noise-2");
const Preset33 = dynamic(load33, { ssr: false });
const load34 = () => import("./presets/35-free-arrow-grid-2");
const Preset34 = dynamic(load34, { ssr: false });
const load35 = () => import("./presets/36-digital-activation-5");
const Preset35 = dynamic(load35, { ssr: false });
const load36 = () => import("./presets/37-arrow-skies-4");
const Preset36 = dynamic(load36, { ssr: false });
const load37 = () => import("./presets/21-realigning-6");
const Preset37 = dynamic(load37, { ssr: false });
const load38 = () => import("./presets/38-enter-the-matrix-1");
const Preset38 = dynamic(load38, { ssr: false });
const load39 = () => import("./presets/39-digital-activation-3");
const Preset39 = dynamic(load39, { ssr: false });
const load40 = () => import("./presets/40-arrow-skies-5");
const Preset40 = dynamic(load40, { ssr: false });
const load41 = () => import("./presets/41-glitch-trail");
const Preset41 = dynamic(load41, { ssr: false });
const load42 = () => import("./presets/42-arrow-skies-3");
const Preset42 = dynamic(load42, { ssr: false });
const load43 = () => import("./presets/43-pistons-3");
const Preset43 = dynamic(load43, { ssr: false });

export const ASCII_BACKGROUND_CATALOG: AsciiBackgroundPreset[] = [
  { id: "3ae43706-ba57-4884-845f-1cc5b413ef59", name: "Tropical Ascii Cam", Component: Preset01, preload: load01 },
  { id: "85fd9855-1a33-4760-8b38-679327d3c8eb", name: "Ascii Tunnel 3", Component: Preset02, preload: load02 },
  { id: "7f41b77a-62a2-42df-a227-ad7ed0760327", name: "ASCII Peaks", Component: Preset03, preload: load03 },
  { id: "d4f87277-7a11-42a9-8486-274438f43e63", name: "Ascii Tunnel 5", Component: Preset04, preload: load04 },
  { id: "6062c95d-99ec-44b3-9613-ab9864228056", name: "Ascii Tunnel 1", Component: Preset05, preload: load05 },
  { id: "3bbaf1dd-1242-4d20-9157-7dc783795343", name: "Ascii Tunnel 2", Component: Preset06, preload: load06 },
  { id: "e54c85be-a8c1-4097-bc47-3db5a77d6934", name: "Ascii Tunnel 6", Component: Preset07, preload: load07 },
  { id: "210fb270-8ff1-4854-8a35-4249c1cb5978", name: "Ascii Tunnel 4", Component: Preset08, preload: load08 },
  { id: "128a514b-9642-4032-a925-9b59c31575a0", name: "Ascii Wave 1", Component: Preset09, preload: load09 },
  { id: "5d810714-6a3c-45f4-9920-d79c84f2edf2", name: "Ascii Wave 3", Component: Preset10, preload: load10 },
  { id: "ae53eacf-8bdc-4532-8e86-a468f21911a0", name: "Bad Signal 2", Component: Preset11, preload: load11 },
  { id: "f6c7812a-51e1-4cb0-a3aa-4dc5e0943e34", name: "Realigning 3", Component: Preset12, preload: load12 },
  { id: "96c91e82-e2ef-4c03-aed6-eafcbf8fc410", name: "Ascii Wave 4", Component: Preset13, preload: load13 },
  { id: "4d5b03f0-1433-44f3-aabc-9ec9c16beecc", name: "Realigning 5", Component: Preset14, preload: load14 },
  { id: "16a2c00f-1946-42ee-b216-c543e51c6f7a", name: "Realigning 1", Component: Preset15, preload: load15 },
  { id: "97a2eff9-5137-41b2-9b8d-f430342b4ee3", name: "Ascii Wave 2", Component: Preset16, preload: load16 },
  { id: "5eabcbad-36b5-4c3a-9a32-20dbf54364a6", name: "Container Ship", Component: Preset17, preload: load17 },
  { id: "4296a6e2-c82d-48ae-8393-788bb38a44f1", name: "Static Noise 1", Component: Preset18, preload: load18 },
  { id: "a048791e-9781-44ff-90c2-6224d152c65e", name: "Realigning 4", Component: Preset19, preload: load19 },
  { id: "51e9190c-97d4-4cfe-82d8-d7cfc1b95d81", name: "Arrow Skies 2", Component: Preset20, preload: load20 },
  { id: "d492f31e-e390-4a8c-aa02-4df3e393b12a", name: "Realigning 2", Component: Preset21, preload: load21 },
  { id: "adfa5af4-3363-49e1-a930-9d1018cc3e9c", name: "Bad Signal 1", Component: Preset22, preload: load22 },
  { id: "9863146a-c4d7-4902-9a83-8ddb093a088d", name: "Free Stars and Stripes 1", Component: Preset23, preload: load23 },
  { id: "ceaf36ce-8870-401f-af70-747c848856b1", name: "Free Stars and Stripes 2", Component: Preset24, preload: load24 },
  { id: "70d6ad9e-95a5-4569-8a31-0dcaeddee95e", name: "Pistons 1", Component: Preset25, preload: load25 },
  { id: "9bb6cf98-77ba-49f4-b861-e61e4a3a1221", name: "Photocopied 7", Component: Preset26, preload: load26 },
  { id: "2f4ff611-aaf8-41b7-9e6d-f8f6bf5d1606", name: "Pistons 4", Component: Preset27, preload: load27 },
  { id: "c22ccc93-ce81-40fd-8146-ef1f5a7c0854", name: "Matrix Rain", Component: Preset28, preload: load28 },
  { id: "08091894-f4c9-4ef8-82fb-73d548353e57", name: "Bad Signal 3", Component: Preset29, preload: load29 },
  { id: "66adbc32-4c4c-44c9-8fdf-31d1658b0fc8", name: "Enter The Matrix 2", Component: Preset30, preload: load30 },
  { id: "8f1220da-f88e-4114-baf2-f055310e299f", name: "Enter The Matrix 3", Component: Preset31, preload: load31 },
  { id: "b0c05ae5-7938-430a-b8b2-8d03be3d5ee4", name: "Free Arrow Grid 1", Component: Preset32, preload: load32 },
  { id: "2c312028-55b2-4c66-8aed-c1b86c035b77", name: "Static Noise 2", Component: Preset33, preload: load33 },
  { id: "f44849d2-c161-4dc3-804a-00484d7174ab", name: "Free Arrow Grid 2", Component: Preset34, preload: load34 },
  { id: "2dabb2a6-7b06-4b50-b0c4-6db620ebc26e", name: "Digital Activation 5", Component: Preset35, preload: load35 },
  { id: "8e2a909f-23c5-467e-9065-c58e53a1c657", name: "Arrow Skies 4", Component: Preset36, preload: load36 },
  { id: "8567f84d-5003-4c90-b841-172abdec4817", name: "Realigning 6", Component: Preset37, preload: load37 },
  { id: "d9df03c5-1515-4e1f-b6fe-304767cdfc17", name: "Enter The Matrix 1", Component: Preset38, preload: load38 },
  { id: "be229fa2-d17a-46de-b539-31b4d4f30e0b", name: "Digital Activation 3", Component: Preset39, preload: load39 },
  { id: "c4b40180-2579-48ae-bac5-036389be60bc", name: "Arrow Skies 5", Component: Preset40, preload: load40 },
  { id: "b21dd29d-92a4-4bc4-937f-edb846d7871d", name: "Glitch Trail", Component: Preset41, preload: load41 },
  { id: "3c2a9955-ac39-4f6a-a7c0-b028e16ba4ae", name: "Arrow Skies 3", Component: Preset42, preload: load42 },
  { id: "a3157072-2910-4275-a1ad-1a7e208ff7af", name: "Pistons 3", Component: Preset43, preload: load43 },
];

export const DEFAULT_ASCII_BACKGROUND_INDEX = ASCII_BACKGROUND_CATALOG.findIndex(
  ({ id }) => id === "5d810714-6a3c-45f4-9920-d79c84f2edf2",
);
