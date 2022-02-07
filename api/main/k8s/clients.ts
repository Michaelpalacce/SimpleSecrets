import { KubeConfig, CoreV1Api, AppsV1Api }		from "@kubernetes/client-node";

export const config		= new KubeConfig();
config.loadFromDefault();

export const apiClient	= config.makeApiClient( CoreV1Api );
export const appsClient	= config.makeApiClient( AppsV1Api );
