function mockAsyncFunc(res, func, name) {
  return function(...args) {
    let cb = args[args.length - 1];
    if(func) {
      func.call(this);
    }
    if(typeof cb === 'function') {
      DevToolsUtils.executeSoon(() => cb(res));
    }
  };
}

function MockClient() {
}
MockClient.prototype = {
  addListener: function() {},
  mainRoot: {
    traits: new Proxy({}, {
      get: function(target, k) {
        if(k === 'noBlackBoxing' || k === 'noPrettyPrinting') {
          return false;
        }
        return true;
      }
    })
  }
};

function MockBreakpointClient(client, sourceClient, actor, loc, cond) {
  this.client = client;
  this.actor = actor;
  this.location = loc;
  this.location.actor = sourceClient.actor;
  this.location.url = sourceClient.url;
  this.source = sourceClient;

  if(cond) {
    this.condition = cond;
  }
}

MockBreakpointClient.prototype = {
  remove: mockAsyncFunc({}),
  hasCondition: function() {
    return !!this.condition;
  },
  getCondition: function() {
    return this.condition;
  },
  setCondition: function(threadClient, cond) {
    let deferred = promise.defer();
    this.condition = cond;
    return deferred.resolve(this);
  }
};

function MockSourceClient(threadClient, form, sourceData) {
  this.isBlackBoxed = false;
  this.isPrettyPrinted = false;
  this.form = Object.assign(
    { isBlackBoxed: false,
      isPrettyPrinted: false },
    form
  );
  this.actor = form.actor;
  this.url = form.url;
  this.thread = threadClient;
  this.client = threadClient.client;

  if(!sourceData.prettedPrintedSource) {
    sourceData.prettedPrintedSource = "// PRETTIFIED\n\n" + sourceData.source;
  }
  this.sourceData = sourceData;
}

MockSourceClient.prototype = {
  blackBox: mockAsyncFunc({}, function() {
    this.isBlackBoxed = true;
    this.thread.emit("blackboxchange", this);
  }),

  unblackBox: mockAsyncFunc({}, function() {
    this.isBlackBoxed = false;
    this.thread.emit("blackboxchange", this);
  }),

  getExecutableLines: mockAsyncFunc([]),

  source: function(cb) {
    DevToolsUtils.executeSoon(() => {
      cb({
        source: (this.isPrettyPrinted ?
                 this.sourceData.prettedPrintedSource :
                 this.sourceData.source),
        contentType: this.sourceData.contentType
      });
    });
  },

  prettyPrint: function(tabSize, cb) {
    DevToolsUtils.executeSoon(() => {
      this.isPrettyPrinted = true;
      cb({
        source: this.sourceData.prettedPrintedSource,
        contentType: this.sourceData.contentType
      });
    });
  },

  disablePrettyPrint: function(cb) {
    DevToolsUtils.executeSoon(() => {
      this.isPrettyPrinted = false
      cb({
        source: this.sourceData.source,
        contentType: this.sourceData.contentType
      });
    });
  },

  setBreakpoint: function({ line, column, condition }, cb) {
    let interrupted = false;
    if(!this.thread.paused) {
      this.thread.interrupt();
      interrupted = true;
    }

    let actorId = 'actor' + (Math.random() * 10000 | 0);

    DevToolsUtils.executeSoon(() => {
      cb({}, new MockBreakpointClient(
        this.client,
        this,
        actorId,
        { line: line,
          column: column },
        condition
      ));

      if(interrupted) {
        this.thread.resume();
      }
    });
  }
};

function MockThreadClient(sources) {
  this._mockSources = sources;
  this.state = "paused";

  EventEmitter.decorate(this);
}

MockThreadClient.prototype = {
  get paused() { return this.state === "paused"; },
  addListener: function(type, handler) {
    this.on(type, handler);
  },
  removeListener: function(type, handler) {
    this.off(type, handler);
  },

  _mockInit: function(sources) {
    this._mockSources = sources;
    this._mockSources.forEach(source => {
      this.emit('newSource', { source: source.form });
    });
  },

  reconfigure: mockAsyncFunc({}),
  resume: mockAsyncFunc({}, function() {
    this.state = "attached";
    this.emit("resumed", { why: { type: '' } });
  }),
  breakOnNext: mockAsyncFunc({}),
  stepOver: mockAsyncFunc({}),
  stepIn: mockAsyncFunc({}),
  stepOut: mockAsyncFunc({}),
  interrupt: mockAsyncFunc({}, function() {
    this.state = "paused";
    this.emit("paused", { why: { type: '' } });
  }),
  pauseOnExceptions: mockAsyncFunc({}),
  pauseOnDOMEvents: mockAsyncFunc({}),
  eval: mockAsyncFunc({}),
  detach: mockAsyncFunc({}),
  releaseMany: mockAsyncFunc({}),
  threadGrips: mockAsyncFunc({}),
  eventListeners: mockAsyncFunc({}),
  getSources: function(cb) {
    DevToolsUtils.executeSoon(() => {
      cb({ sources: this._mockSources.map(s => s.form) });
    });
  },
  cachedFrames: [],
  moreFrames: [],
  fillFrames: mockAsyncFunc({}),
  pauseGrip: mockAsyncFunc({}),
  pauseLongString: mockAsyncFunc({}),
  threadLongString: mockAsyncFunc({}),
  environment: mockAsyncFunc({}),
  source: function(form) {
    return this._mockSources.filter(src => src.actor === form.actor)[0];
  },
  getPrototypeAndProperties: mockAsyncFunc({}),

  mockThreadEvent: function(event, args) {
    this.emit(event, args);
  }
};

function MockTab(client, threadClient) {
  this._client = client;
  this._threadClient = threadClient;
}
MockTab.prototype = {
  attachThread: function(opts, cb) {
    this._threadClient.client = this._client;
    cb({}, this._threadClient);
  }
};

function MockTarget(mockedThreadClient) {
  this.isTabActor = true;
  this.isAddon = false;
  this.form = {};
  this.client = new MockClient();
  this.activeTab = new MockTab(this.client, mockedThreadClient);
  EventEmitter.decorate(this);
};

