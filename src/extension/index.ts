import type NodeCG from '@nodecg/types';

module.exports = function (nodecg: NodeCG.ServerAPI) {
	nodecg.log.info("Hello, from your bundle's extension!");
};
