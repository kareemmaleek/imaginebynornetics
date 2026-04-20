const prefixes = [
  "Neural", "Pixel", "Cyber", "Quantum", "Nebula", "Astro", "Vortex",
  "Cosmo", "Prism", "Neon", "Synth", "Drift", "Flux", "Echo", "Nova",
  "Apex", "Zen", "Arc", "Bolt", "Crisp", "Dusk", "Ember", "Frost",
  "Glow", "Haze", "Ion", "Jade", "Kryp", "Lux", "Mist", "Onyx",
];

const suffixes = [
  "Aptos", "Wave", "Core", "Spark", "Orbit", "Pulse", "Shift", "Link",
  "Storm", "Edge", "Forge", "Hex", "Blaze", "Vine", "Crest", "Stone",
  "Tide", "Fuse", "Glyph", "Matrix", "Node", "Sage", "Byte", "Craft",
  "Dawn", "Sky", "Cage", "Grid", "Mint", "Rush", "Rift",
];

/**
 * Generates a random username like "NeuralAptos28"
 * Format: PascalCase prefix + PascalCase suffix + 2-digit number
 */
function generateUsername() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${prefix}${suffix}${num}`;
}

module.exports = { generateUsername };
