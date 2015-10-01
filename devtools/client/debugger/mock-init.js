(function(installMocks) {
  setTimeout(() => {
    if(!DebuggerController._target) {
      installMocks();
    }
  }, 100);
})(function() {
  let threadClient = new MockThreadClient();
  let sources = [
    new MockSourceClient(
      threadClient,
      { url: 'http://example.com/foo.js',
        actor: 'actor1' },
      { source: '\n\nvar x = 5;\nvar y = 6;\nvar z = 7;', contentType: 'text/javascript', }
    ),
    new MockSourceClient(
      threadClient,
      { url: 'http://example.com/bar.js', actor: 'actor2' },
      { source: '\nconsole.log("from bar");\n'.repeat(10), contentType: 'text/javascript' }
    ),
    new MockSourceClient(
      threadClient,
      { url: 'http://example.com/baz.js', actor: 'actor3' },
      { source: '\nfunction baz() { return 5 };',
        contentType: 'text/javascript' }
    )
  ];

  DebuggerController._target = new MockTarget(threadClient);
  DebuggerController._toolbox = {};

  DebuggerController.startupDebugger().then(() => {
    return DebuggerController.connect();
  }).then(() => {
    DebuggerController.activeThread._mockInit(sources);
  });
});
