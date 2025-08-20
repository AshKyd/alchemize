import { WorkerHost } from "workiq";

const worker = new Worker(new URL("./converterWorker.js", import.meta.url), {
  type: "module",
});

export default new WorkerHost({ workers: [worker], logLevel: "debug" });
