import { createStore, Store } from 'vuex'
import { InjectionKey } from "vue";
import SimpleSecrets from "@/store/interfaces/simpleSecret";
import Communicator from "@/assets/js/api/Communicator";

/**
 * One day in MS
 */
const DEFAULT_CHECK_INTERVAL_MS	= 86400000;

interface State {
	latestVersion: string;
	currentVersion: string;
	currentNamespace: string;
	namespaces: string[];
	secrets: {
		[namespace: string]: SimpleSecrets[]
	};
}
export const key: InjectionKey<Store<State>>	= Symbol()

const communicator		= new Communicator();

export const store		= createStore<State>({
	state: {
		latestVersion: "",
		currentVersion: "",
		currentNamespace: 'default',
		namespaces: [],
		secrets: {}
	},
	mutations: {
		updateNamespaces( state, { namespaces } ) { state.namespaces = namespaces; },
		changeCurrentNamespace( state, { newNamespace } ) { state.currentNamespace = newNamespace; },
		storeNamespacedSecrets( state, { namespace, secrets } ) { state.secrets[namespace]	= secrets; },
		deleteNamespacedSecret( state, { namespace, name } ) {
			state.secrets[namespace]	= state.secrets[namespace].filter( secret => {
				return secret.name !== name;
			});

			if ( state.secrets[namespace].length === 0 )
				state.namespaces	= state.namespaces.filter( currNamespace => currNamespace !== namespace );
		},
		storeNamespacedSecretData( state, { namespace, newSecret } ) {
			if ( typeof state.secrets[namespace] === 'undefined' )
				state.secrets[namespace]	= [];

			if ( typeof state.namespaces !== 'undefined' && state.namespaces.indexOf( namespace ) === -1 )
				state.namespaces.push( namespace );

			let found	= false;
			state.secrets[namespace].forEach( secret => {
				if ( secret.name === newSecret.name ) {
					secret.data		= newSecret.data;
					secret.version	= newSecret.version;
					found			= true;
				}
			});

			if ( ! found )
				state.secrets[namespace].push( newSecret );
		}
	},
	actions: {
		async changeCurrentNamespace({ state, commit, dispatch }, newNamespace ) {
			commit( "changeCurrentNamespace", { newNamespace } );
			if ( typeof state.secrets[newNamespace] === 'undefined' )
				dispatch( "fetchSecrets", newNamespace );
		},

		async updateVersions({ state, commit, dispatch } ) {
			if ( ! localStorage.latestCheck || localStorage.latestCheck < Date.now() - DEFAULT_CHECK_INTERVAL_MS ) {
				const latestResponse	= await communicator.getLatestVersion();
				const currentResponse	= await communicator.getCurrentVersion();
				if ( latestResponse.status === 200 && currentResponse.status === 200 ) {
					state.latestVersion		= localStorage.latestVersion	= latestResponse.data;
					state.currentVersion	= localStorage.currentVersion	= currentResponse.data;
				}
			}
		},

		async fetchSecrets({ state, commit }, namespace ) {
			const response				= await communicator.getSecretsForNamespace( namespace );
			commit( "storeNamespacedSecrets", { namespace, secrets: response.data } );
		},
		async fetchSecretsForCurrentNamespace({ state, dispatch }) {
			const namespace				= state.currentNamespace;
			dispatch( "fetchSecrets", namespace );
		},
		async fetchNamespaces({ commit }) {
			const response			= await communicator.getAllSecrets();
			const secrets			= response.data;

			if ( !secrets || secrets.length === 0 )
				return;

			const namespaces		= [...new Set(secrets.map( secret => {
					return secret.namespace;
				})
			)];

			commit( 'updateNamespaces', { namespaces } );
		},
		async fetchSecret({ commit, state }, { namespace, name }) {
			const response	= await communicator.getSecret( namespace, name );

			commit( 'storeNamespacedSecretData', { namespace, newSecret: response.data } );
		},

		async updateSecret({ dispatch, state }, { namespace, name, data }) {
			await communicator.updateSecret( namespace, name, JSON.parse( data ) );

			dispatch( 'fetchSecret', { namespace, name } );
		},

		async createSecret({ dispatch, state }, secret: { namespace: string, name: string } ) {
			const { namespace, name }	= secret;
			await communicator.createSecret( secret );

			dispatch( 'fetchSecret', { namespace, name } );
		},
		async deleteSecret({ commit, state }, { namespace, name }) {
			await communicator.deleteSecret( namespace, name );

			commit( 'deleteNamespacedSecret', { namespace, name } );
		}
	},
	modules: {
	},
	getters: {
		secret: ( state ) => ( namespace: string, name: string ) => {
			return state.secrets[namespace].find( secret => secret.name === name );
		}
	}
})
