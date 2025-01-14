import { getPendingGroupCategory } from '@/isomorphic/tx';
import {
  TransactionGroup,
  TransactionHistoryItem,
} from '@/isomorphic/types/rabbyx';
import {
  walletOpenapi,
  walletTestnetOpenapi,
} from '@/renderer/ipcRequest/rabbyx';
import { getTokenSymbol } from '@/renderer/utils';
import { findChain, findChainByID } from '@/renderer/utils/chain';
import { TokenItem, TxRequest } from '@rabby-wallet/rabby-api/dist/types';
import { useRequest } from 'ahooks';
import { flatten, keyBy } from 'lodash';

export const useTxRequests = (
  reqIds: string | string[],
  options?: {
    onSuccess?: (data: Record<string, TxRequest>) => void;
  }
) => {
  const onSuccess = options?.onSuccess;
  return useRequest(
    async () => {
      const res = await walletOpenapi.getTxRequests(reqIds);
      return keyBy(res, 'id');
    },
    {
      refreshDeps: [Array.isArray(reqIds) ? reqIds.join(',') : reqIds],
      onSuccess,
    }
  );
};

export const useGetTx = ({
  hash,
  serverId,
  gasPrice,
}: {
  hash?: string;
  serverId?: string;
  gasPrice: number;
}) => {
  return useRequest(
    async () => {
      if (!hash || !serverId) {
        return;
      }
      const res = await walletOpenapi.getTx(serverId, hash, gasPrice);
      return res;
    },
    {
      cacheKey: `${serverId}-${hash}-${gasPrice}`,
      refreshDeps: [hash, serverId, gasPrice],
    }
  );
};

export const useLoadTxRequests = (
  pendings: TransactionGroup[],
  options?: {
    onSuccess?: (data: Record<string, TxRequest>) => void;
  }
) => {
  const { unbroadcastedTxs } = getPendingGroupCategory(pendings);
  const testnetTxs: TransactionHistoryItem[] = [];
  const mainnetTxs: TransactionHistoryItem[] = [];

  unbroadcastedTxs.forEach((tx) => {
    const chain = findChainByID(tx.rawTx.chainId);
    if (chain?.isTestnet) {
      testnetTxs.push(tx);
    } else {
      mainnetTxs.push(tx);
    }
  });

  const onSuccess = options?.onSuccess;
  const { data, runAsync } = useRequest(
    async () => {
      const res = await Promise.all([
        testnetTxs?.length
          ? walletTestnetOpenapi
              .getTxRequests(testnetTxs.map((tx) => tx.reqId) as string[])
              .catch(() => [])
          : [],
        mainnetTxs?.length
          ? walletOpenapi
              .getTxRequests(mainnetTxs.map((tx) => tx.reqId) as string[])
              .catch(() => [])
          : [],
      ]);
      const map = keyBy(flatten(res), 'id');
      return map;
    },
    {
      onSuccess,
      refreshDeps: [unbroadcastedTxs.map((tx) => tx.reqId).join(',')],
    }
  );

  return {
    txRequests: data || {},
    reloadTxRequests: runAsync,
  };
};

export const useLoadTxData = (item: TransactionGroup) => {
  const chain = findChain({
    id: item.chainId,
  })!;

  const completedTx = item.txs.find(
    (tx) => tx.isCompleted && !tx.isSubmitFailed && !tx.isWithdrawed
  );

  const hasTokenPrice = !!item.explain?.native_token;
  const gasTokenCount =
    hasTokenPrice && completedTx
      ? (Number(
          completedTx.rawTx.gasPrice || completedTx.rawTx.maxFeePerGas || 0
        ) *
          (completedTx.gasUsed || 0)) /
        1e18
      : 0;
  const gasUSDValue = gasTokenCount
    ? (item.explain.native_token.price * gasTokenCount).toFixed(2)
    : 0;
  const gasTokenSymbol = hasTokenPrice
    ? getTokenSymbol(item.explain.native_token)
    : '';

  const loadTxData = async () => {
    if (gasTokenCount) {
      return;
    }
    let map: Record<
      string,
      {
        frontTx?: number;
        gasUsed?: number;
        token?: TokenItem;
        tokenCount?: number;
      }
    > = {};
    if (completedTx) {
      const res = await walletOpenapi.getTx(
        chain.serverId,
        completedTx.hash!,
        Number(
          completedTx.rawTx.gasPrice || completedTx.rawTx.maxFeePerGas || 0
        )
      );
      map = {
        ...map,
        [res.hash]: {
          token: res.token,
          tokenCount:
            (res.gas_used *
              Number(
                completedTx!.rawTx.gasPrice ||
                  completedTx!.rawTx.maxFeePerGas ||
                  0
              )) /
            1e18,
          gasUsed: res.gas_used,
        },
      };
      return map;
    }

    const results = await Promise.all(
      item.txs
        .filter((tx) => !tx.isSubmitFailed && !tx.isWithdrawed && tx.hash)
        .map((tx) =>
          walletOpenapi.getTx(
            chain.serverId,
            tx.hash!,
            Number(tx.rawTx.gasPrice || tx.rawTx.maxFeePerGas || 0)
          )
        )
    );

    results.forEach(
      ({ code, status, front_tx_count, gas_used, token }, index) => {
        map = {
          ...map,
          [item.txs[index].hash!]: {
            frontTx: front_tx_count,
          },
        };
      }
    );
    return map;
  };

  const { data: txQueues, runAsync: runLoadTxData } = useRequest(loadTxData);

  return {
    txQueues: txQueues || {},
    runLoadTxData,
    gasTokenSymbol,
    gasUSDValue,
    gasTokenCount,
  };
};
