/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const namedLoggerLevels = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
  off: 7,
  always: 8
};
const TRACE = namedLoggerLevels.trace;
const DEBUG = namedLoggerLevels.debug;
const INFO = namedLoggerLevels.info;
const WARN = namedLoggerLevels.warn;
const ERROR = namedLoggerLevels.error;
const FATAL = namedLoggerLevels.fatal;
const ALWAYS = namedLoggerLevels.always;
const OFF = namedLoggerLevels.off;

const loggerLevelNames = new Map(
  Object.entries(namedLoggerLevels).map(e => [e[1], e[0].toUpperCase()])
);

const slice = Array.prototype.slice;

export default class ConsoleLogger {
  constructor(levelName) {
    this.setLevel(levelName);
    this.always = this.loggerMethod(ALWAYS);
    this.fatal = this.loggerMethod(FATAL);
    this.error = this.loggerMethod(ERROR);
    this.warn = this.loggerMethod(WARN);
    this.info = this.loggerMethod(INFO);
    this.debug = this.loggerMethod(DEBUG);
    this.trace = this.loggerMethod(TRACE);
  }

  setLevel(levelName) {
    if (!namedLoggerLevels.hasOwnProperty(levelName)) {
      this.logAtLevel(ALWAYS, [
        `ConsoleLogger: unknown log-level ("${levelName}")`
      ]);
      levelName = 'error';
    }
    this.level = namedLoggerLevels[levelName];
    this.logAtLevel(ALWAYS, [`Log level is ${levelName} (${this.level})`]);
  }

  loggerMethod(messageImportance) {
    const thisLogger = this;
    return function() {
      thisLogger.logAtLevel(messageImportance, slice.call(arguments));
    };
  }

  tag(level) {
    const levelName = loggerLevelNames.get(level) || `loglevel(${level})`;
    return `${new Date().toISOString()} ${levelName}`;
  }

  logAtLevel(messageImportance, logArgs) {
    if (messageImportance >= this.level) {
      if (messageImportance >= ERROR) {
        console.log(
          `%c${this.tag(messageImportance)}`,
          'background:pink;',
          ...logArgs
        );
      } else {
        console.log(this.tag(messageImportance), ...logArgs);
      }
    }
  }
}
