export interface Config {
  perplexity: {
    model: string;
    apiKey?: string;
    maxTokens?: number;
  };
  gemini: {
    model: string;
    apiKey?: string;
    maxTokens?: number;
  };
}

export const defaultConfig: Config = {
  perplexity: {
    model: 'llama-3.1-sonar-large-128k-online',
    maxTokens: 4000,
  },
  gemini: {
    model: 'gemini-2.0-flash-thinking-exp',
    maxTokens: 10000,
  },
};

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import dotenv from 'dotenv';

export function loadConfig(): Config {
  // Try loading from current directory first
  try {
    const localConfigPath = join(process.cwd(), 'just-ask.config.json');
    const localConfig = JSON.parse(readFileSync(localConfigPath, 'utf-8'));
    return { ...defaultConfig, ...localConfig };
  } catch {
    // If local config doesn't exist, try home directory
    try {
      const homeConfigPath = join(homedir(), '.just-ask', 'config.json');
      const homeConfig = JSON.parse(readFileSync(homeConfigPath, 'utf-8'));
      return { ...defaultConfig, ...homeConfig };
    } catch {
      // If neither config exists, return default config
      return defaultConfig;
    }
  }
}

export function loadEnv(): void {
  // Try loading from current directory first
  try {
    const localEnvPath = join(process.cwd(), '.just-ask.env');
    dotenv.config({ path: localEnvPath });
    return;
  } catch {
    // If local env doesn't exist, try home directory
    try {
      const homeEnvPath = join(homedir(), '.just-ask', '.env');
      dotenv.config({ path: homeEnvPath });
      return;
    } catch {
      // If neither env file exists, continue without loading
      return;
    }
  }
}
