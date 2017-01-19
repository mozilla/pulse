import styles from "./styles.scss"; // eslint-disable-line no-unused-vars
import Logger from "../../lib/log";
import Open from "./lib/open";

const logger = new Logger("webext.survey", window.console);

function main() {
  logger.log("Initializing");

  window.app = { open: new Open() };
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
