<template>
	<div class="flex flex-no-wrap">
		<!-- Sidebar starts -->
		<!-- Remove class [ hidden ] and replace [ sm:flex ] with [ flex ] -->
		<div style="min-height: 716px"
			 class="top-0 bottom-0 w-64 absolute  bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex">
			<div class="px-8">
				<Logo/>
				<ul class="mt-12">
					<li class="flex w-full justify-between text-gray-400 hover:text-gray-300 cursor-pointer items-center">
						<a href="javascript:void(0)"
						   class="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
							<PlusCircleIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />

							<button
								class="text-sm ml-2"
								@click="createModalVisible = true">New Secret
							</button>

						</a>
					</li>
				</ul>
			</div>
			<!--      <div class="px-8 border-t border-gray-700">-->
			<!--        <ul class="w-full flex items-center justify-between bg-gray-800">-->
			<!--          <li class="cursor-pointer text-white pt-5 pb-3">-->
			<!--            <button aria-label="show notifications" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
			<!--              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg3.svg" alt="notifications">-->
			<!--            </button>-->
			<!--          </li>-->
			<!--          <li class="cursor-pointer text-white pt-5 pb-3">-->
			<!--            <button aria-label="open chats" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
			<!--              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg4.svg" alt="chat">-->
			<!--            </button>-->
			<!--          </li>-->
			<!--          <li class="cursor-pointer text-white pt-5 pb-3">-->
			<!--            <button aria-label="open settings" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
			<!--              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg5.svg" alt="settings">-->
			<!--            </button>-->
			<!--          </li>-->
			<!--          <li class="cursor-pointer text-white pt-5 pb-3">-->
			<!--            <button aria-label="open logs" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
			<!--              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg6.svg" alt="drawer">-->
			<!--            </button>-->
			<!--          </li>-->
			<!--        </ul>-->
			<!--      </div>-->
		</div>
		<div
			class="w-64 z-40 top-0 bottom-0 absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden transition duration-150 ease-in-out"
			id="mobile-nav">
			<button aria-label="toggle sidebar" id="openSideBar"
					class="h-10 w-10 bg-gray-800 absolute right-0 mt-16 -mr-10 flex items-center shadow rounded-tr rounded-br justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded focus:ring-gray-800"
					@click="sidebarHandler(true)">
				<img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg7.svg"
					 alt="toggler">
			</button>
			<button aria-label="Close sidebar" id="closeSideBar"
					class="hidden h-10 w-10 bg-gray-800 absolute right-0 mt-16 -mr-10 flex items-center shadow rounded-tr rounded-br justify-center cursor-pointer text-white"
					@click="sidebarHandler(false)">
				<img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg8.svg"
					 alt="cross">
			</button>
			<div class="px-8">
				<Logo/>
				<ul class="mt-12">
					<li class="flex w-full justify-between text-gray-400 hover:text-gray-300 cursor-pointer items-center">
						<a href="javascript:void(0)"
						   class="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
							<PlusCircleIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
							<button
								class="text-sm ml-2"
								@click="createModalVisible = true">New Secret
							</button>
						</a>
					</li>
				</ul>
			</div>
<!--			      <div class="px-8 border-t border-gray-700">-->
<!--			        <ul class="w-full flex items-center justify-between bg-gray-800">-->
<!--			          <li class="cursor-pointer text-white pt-5 pb-3">-->
<!--			            <button aria-label="show notifications" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
<!--			              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg3.svg" alt="notifications">-->
<!--			            </button>-->
<!--			          </li>-->
<!--			          <li class="cursor-pointer text-white pt-5 pb-3">-->
<!--			            <button aria-label="open chats" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
<!--			              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg4.svg" alt="chat">-->
<!--			            </button>-->
<!--			          </li>-->
<!--			          <li class="cursor-pointer text-white pt-5 pb-3">-->
<!--			            <button aria-label="open settings" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
<!--			              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg5.svg" alt="settings">-->
<!--			            </button>-->
<!--			          </li>-->
<!--			          <li class="cursor-pointer text-white pt-5 pb-3">-->
<!--			            <button aria-label="open logs" class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300">-->
<!--			              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg6.svg" alt="drawer">-->
<!--			            </button>-->
<!--			          </li>-->
<!--			        </ul>-->
<!--			      </div>-->
		</div>
		<!-- Sidebar ends -->
		<!-- Remove class [ h-64 ] when adding a card block -->
		<div class="container sm:ml-72 py-10 px-6">
			<!-- Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border -->
			<div class="w-full h-full rounded border-dashed border-2 border-gray-300">
				<div class="mt-2 w-full">
					<Namespace class="inline-block" :namespaces="namespaces"></Namespace>
				</div>
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="py-3 px-6">
							Name
						</th>
						<th scope="col" class="py-3 px-6">
							Version
						</th>
						<th scope="col" class="py-3 px-6">
							In Use
						</th>
						<th scope="col" class="py-3 px-6">
							Actions
						</th>
					</tr>
					</thead>
					<tbody>

					<tr class="bg-white dark:bg-gray-800" v-for="secret in secrets">
						<th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer" @click="getSecret(secret)">
							{{ secret.name }}
						</th>
						<td class="py-4 px-6">
							{{ secret.version }}
						</td>
						<td class="py-4 px-6">
							<div
								class="w-4 h-4 mt-2 rounded-full animate-pulse"
								:class="`${secret.inUse ? 'bg-green-400' : 'bg-red-500'}`"
							></div>
						</td>
						<td class="py-4 px-6">
							<TrashIcon class="text-red-500 h-7 inline-block cursor-pointer" @click="deleteSecret( secret )"/>
							<PencilIcon class="text-green-500 h-7 inline-block cursor-pointer" @click="getSecret( secret )"/>
						</td>
					</tr>
					</tbody>
				</table>

<!--				<div-->
<!--					class="grid grid-cols-1 gap-2  lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-4 mt-32 md:mt-12 p-2">-->
<!--&lt;!&ndash;					<SecretCard v-for="secret in secrets"&ndash;&gt;-->
<!--&lt;!&ndash;								:name="secret.name" :namespace="secret.namespace" :version="secret.version"&ndash;&gt;-->
<!--&lt;!&ndash;								:inUse="secret.inUse"&ndash;&gt;-->
<!--&lt;!&ndash;								@clicked="getSecret" @onDelete="deleteSecret"&ndash;&gt;-->
<!--&lt;!&ndash;					/>&ndash;&gt;-->
<!--				</div>-->

				<UpdateModal v-if="modalVisible" :secret="modalSecret" @onClose="hideModal" @onSubmit="submitModal"/>
				<CreateModal v-if="createModalVisible" :secret="modalSecret" @onClose="hideCreateModal"
							 @onSubmit="submitCreateModal"/>
			</div>
		</div>
	</div>
</template>

<script>
import {defineComponent} from 'vue';
import SecretCard									from "@/components/Secret/SecretCard.vue";
import Namespace									from '@/components/Dropdowns/Namespace.vue';
import UpdateModal									from '@/components/Modal/UpdateModal.vue';
import CreateModal									from '@/components/Modal/CreateModal.vue';
import Logo											from "@/views/Components/Logo";
import { PlusCircleIcon, TrashIcon, PencilIcon }	from '@heroicons/vue/solid'


export default defineComponent({
	name: 'Home',
	data: () => {
		return {
			createModalVisible: false,
			modalVisible: false,
			modalSecret: {}
		}
	},
	components: {TrashIcon, PencilIcon, PlusCircleIcon, Logo, SecretCard, Namespace, UpdateModal, CreateModal},
	async created() {
		await this.refreshCurrent();

		this.sideBar = document.getElementById("mobile-nav");
		this.openSidebar = document.getElementById("openSideBar");
		this.closeSidebar = document.getElementById("closeSideBar");
		this.sideBar.style.transform = "translateX(-260px)";
	},
	computed: {
		namespaces() {
			return this.$store.state.namespaces;
		},
		secrets() {
			return this.$store.state.secrets[this.$store.state.currentNamespace];
		}
	},
	methods: {
		sidebarHandler(flag) {
			if (flag) {
				this.sideBar.style.transform = "translateX(0px)";
				this.openSidebar.classList.add("hidden");
				this.closeSidebar.classList.remove("hidden");
			} else {
				this.sideBar.style.transform = "translateX(-260px)";
				this.closeSidebar.classList.add("hidden");
				this.openSidebar.classList.remove("hidden");
			}
		},

		async refreshCurrent() {
			await this.$store.dispatch('fetchNamespaces');
			await this.$store.dispatch('fetchSecretsForCurrentNamespace');
		},
		async getSecret(target) {
			const namespace = target.namespace;
			const name = target.name;
			await this.$store.dispatch('fetchSecret', {namespace, name});

			this.modalSecret = this.$store.getters.secret(namespace, name)
			this.modalVisible = true;
		},
		async deleteSecret(target) {
			console.log(target)
			const namespace = target.namespace;
			const name = target.name;
			await this.$store.dispatch('deleteSecret', {namespace, name});
		},
		async hideModal() {
			this.modalVisible = false;
		},
		async submitModal() {
			this.modalVisible = false;
		},
		async hideCreateModal() {
			this.createModalVisible = false;
		},
		async submitCreateModal() {
			this.createModalVisible = false;
		},
	}
});
</script>
