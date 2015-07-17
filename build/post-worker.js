  return __ffmpegjs_return;
}

var __ffmpegjs_running = false;

self.onmessage = function(e) {
  var msg = e.data;
  var opts;
  if (msg.type == "run") {
    if (__ffmpegjs_running) {
      self.postMessage({type: "error", error: "already running"});
    } else {
      __ffmpegjs_running = true;
      self.postMessage({type: "run"});
      opts = {};
      for (key in msg) {
        if (key !== "type") {
          opts[key] = msg[key]
        }
      }
      opts.print = function(data) {
        self.postMessage({type: "stdout", data: data});
      }
      opts.printErr = function(data) {
        self.postMessage({type: "stderr", data: data});
      }
      opts.onExit = function(code) {
        self.postMessage({type: "exit", data: code});
      }
      // TODO(Kagami): Should we wrap this function into try/catch in
      // case of possible exception?
      __ffmpegjs(opts);
      __ffmpegjs_running = false;
      self.postMessage({type: "done"});
    }
  } else {
    self.postMessage({type: "error", error: "unknown command"});
  }
};

self.postMessage({type: "ready"});
