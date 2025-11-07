// scripts/update-commit-hash.cjs
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const appJsonPath = path.join(__dirname, "..", "app.json");

try {
  const appConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
  const commitHash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  console.log("✅ Commit hash encontrado:", commitHash);

  appConfig.expo.extra = appConfig.expo.extra || {};
  appConfig.expo.extra.commitHash = commitHash;

  fs.writeFileSync(appJsonPath, JSON.stringify(appConfig, null, 2) + "\n");
  console.log("📦 app.json atualizado com o commit hash!");
} catch (error) {
  console.error("⚠️ Erro ao atualizar o commit hash:", error.message);
  // Não encerra o processo para não bloquear o desenvolvimento
  // Se não conseguir obter o hash, mantém o valor atual
}

