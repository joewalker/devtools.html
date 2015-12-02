const prefs = require('devtools/sham/services/prefs');

// React
const React = require("react");
const ReactDOM = require("react-dom");
const Provider = React.createFactory(require("react-redux").Provider);

// Used to create the Redux store
const createStore = require("devtools/client/shared/redux/create-store")({
  getTargetClient: () => DebuggerController.client,
  log: false
});
const {
  makeStateBroadcaster,
  enhanceStoreWithBroadcaster,
  combineBroadcastingReducers
} = require("devtools/client/shared/redux/non-react-subscriber");
const { bindActionCreators } = require('devtools/client/shared/vendor/redux');
const constants = require("./content/constants");
const reducers = require("./content/reducers");
const actions = require("./content/actions");
const queries = require("./content/queries");
const { onReducerEvents } = require("./content/utils");

const waitUntilService = require("devtools/client/shared/redux/middleware/wait-service");
var services = {
  WAIT_UNTIL: waitUntilService.NAME
};

// Components

const Debugger = React.createFactory(require('./content/components/Debugger'));

// Global store

function initializeStore() {
  const broadcaster = makeStateBroadcaster(() => true);
  const reducer = combineBroadcastingReducers(
    reducers,
    broadcaster.emitChange
  );
  let store = createStore((state, action) => {
    if (action.seqId &&
        (action.status === 'done' || action.status === 'error') &&
        state && state.asyncRequests.indexOf(action.seqId) === -1) {
      return state;
    }
    return reducer(state, action);
  });
  store = enhanceStoreWithBroadcaster(store, broadcaster);
  window.gStore = store;
}

function render() {
  ReactDOM.render(
    Provider({ store: gStore }, Debugger()),
    document.querySelector('#mount')
  );
}

// Events

function onConnect(thread) {
  initializeStore();
  const {
    selectSource, newSource, fetchEventListeners, loadSources
  } = bindActionCreators(actions, gStore.dispatch);

  thread.addListener("newSource", (event, packet) => {
    newSource(packet.source);
  });

  thread.addListener("paused", (event, packet) => {
    if(packet.frame && packet.frame.where) {
      let source;
      if(packet.frame.where.url) {
        // When using Valence to connect with Chrome, we get back a
        // URL instead of a source for some reason
        source = queries.getSourceByURL(gStore.getState(), packet.frame.where.url)
      }
      else {
        source = packet.frame.where.source;
      }

      selectSource(source, {
        line: packet.frame.where.line
      })
    }
  });

  loadSources();
  render();
}

function onClose() {
  thread.removeListener("newSource");
}

function onNavigate() {
}

function onWillNavigate() {
  gStore.dispatch({ type: constants.UNLOAD });
}

// Initialization

function connect(target) {
  target.on("close", onClose);
  target.on("navigate", onNavigate);
  target.on("will-navigate", onWillNavigate);

  let threadOptions = {
    useSourceMaps: prefs.getBoolPref("devtools.debugger.source-maps-enabled"),
    autoBlackBox: prefs.getBoolPref("devtools.debugger.auto-black-box")
  };

  return new Promise((resolve, reject) => {
    target.activeTab.attachThread(threadOptions, (aResponse, aThreadClient) => {
      if (!aThreadClient) {
        reject(new Error("Couldn't attach to thread: " + aResponse.error));
        return;
      }
      window.gThreadClient = aThreadClient;
      onConnect(gThreadClient);

      if (aThreadClient.paused) {
        aThreadClient.resume();
      }

      resolve();
    });
  });
}

window.connect = connect;
