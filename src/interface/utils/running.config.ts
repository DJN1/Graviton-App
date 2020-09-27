import { state } from '@mkenzo_8/puffin'
import { PuffinState } from 'Types/puffin.state'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import isDev from 'electron-is-dev'
import { remote } from 'electron'
import minimist from 'minimist'
const nodeJSONRPC = window.require('node-jsonrpc-lsp')
import isGitInstalled from './is.git.installed'

const electronArguments = isDev ? remote.process.argv.slice(2) : remote.process.argv.slice(1) || []
const parsedElectronArguments = minimist(electronArguments)
const parsedRendererArguments = isDev ? minimist(process.argv.slice(5)) : minimist(process.argv.slice(1))
const LSPPort = isDev ? 2020 : 2089

const DEFAULT_RUNTIME_CONFIGURATION = {
	focusedPanel: null,
	focusedTab: null,
	focusedEditor: null,
	workspacePath: null,
	iconpack: {},
	isDebug: parsedRendererArguments.mode === 'debug',
	isDev,
	workspaceConfig: {
		name: null,
		folders: [],
	},
	globalCommandPrompt: [],
	notifications: [],
	editorsRank: [CodemirrorClient, ImageViewerClient],
	openedWindows: 0,
	arguments: electronArguments,
	parsedArguments: parsedElectronArguments,
	currentStaticConfig: {},
	envs: [],
	projectServices: [],
	languageServers: [],
	LSPPort,
	LSPServers: {},
	isGitInstalled: false,
}

isGitInstalled().then(res => {
	if (res !== RunningConfig.data.isGitInstalled) {
		RunningConfig.data.isGitInstalled = res
	}
})

const RunningConfig: PuffinState = new state(DEFAULT_RUNTIME_CONFIGURATION)

RunningConfig.on('appLoaded', () => {
	const lspServer = new nodeJSONRPC({
		port: LSPPort,
		languageServers: {},
	})
	RunningConfig.on('registerLanguageServer', ({ modes, args }) => {
		modes.forEach((name: string) => {
			if (!RunningConfig.data.LSPServers[name]) RunningConfig.data.LSPServers[name] = []
			RunningConfig.data.LSPServers[name].push({
				server: args,
			})
			lspServer.addLanguageServer(name, args)
		})
	})
})

RunningConfig.on('registerEnvironmentInspector', function ({ name, prefix, filter }) {
	RunningConfig.data.envs.push({
		name,
		prefix,
		filter,
	})
})

export default RunningConfig