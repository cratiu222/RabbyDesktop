import { MouseEventHandler, useMemo, useEffect, useRef } from 'react';

import { IconWithChain } from '@/renderer/components/TokenWithChain';
import clsx from 'clsx';
import { Alert, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { ApprovalItem } from '@/renderer/utils/approval';
import { findChainByServerID } from '@/renderer/utils/chain';
import IconExternal from '@/../assets/icons/common/share.svg';
import IconArrowRight from '../icons/right.svg?rc';
import IconUnknown from '../icons/icon-unknown-1.svg';
// import IconExternal from '../icons/icon-share.svg';
import { openScanLinkFromChainItem } from '../utils';
import ApprovalsNameAndAddr from './NameAndAddr';

type Props = {
  data: ApprovalItem[];
  index: number;
  setSize?: (i: number, h: number) => void;
  onClick?: (item: ApprovalItem) => void;
  showNFTAmount?: boolean;
};

export const ApprovalContractItem = ({
  data,
  index,
  setSize,
  onClick: onSelect,
  showNFTAmount = false,
}: Props) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const item = data[index];

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement)?.id !== 'copyIcon') {
      onSelect?.(item);
    }
  };

  const risky = useMemo(
    () => ['danger', 'warning'].includes(item.risk_level),
    [item.risk_level]
  );

  useEffect(() => {
    if (risky && setSize && rowRef.current?.getBoundingClientRect) {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }
  }, [risky, item, setSize, index]);

  const chainItem = useMemo(
    () => findChainByServerID(item.chain),
    [item.chain]
  );

  const contractAddrNote = item.name || 'Unknown';

  return (
    <div
      ref={rowRef}
      className={clsx(
        'bg-transparent text-[#fff] mb-[20px] rounded-[6px] contract-approval-item',
        'px-[0] pt-[8px] pb-[9px]',
        onSelect &&
          'hover:border-blue-light hover:bg-blue-light hover:bg-opacity-[0.1] cursor-pointer'
      )}
      key={item.id + item.chain}
      onClick={handleClick}
    >
      <div
        className={clsx(
          'token-approval-item px-[16px] pt-[11px] pb-[10px] hover:bg-transparent hover:border-transparent',
          !onSelect && 'cursor-auto'
        )}
      >
        <IconWithChain
          width="18px"
          height="18px"
          hideConer
          hideChainIcon
          iconUrl={chainItem?.logo || IconUnknown}
          chainServerId={item.chain}
          noRound={item.type === 'nft'}
        />

        <div className="ml-2 flex">
          <div
            className={clsx('token-approval-item-desc', {
              'text-13': item.type === 'token',
            })}
          >
            <ApprovalsNameAndAddr
              addressClass="font-medium"
              address={item.id}
              chainEnum={chainItem?.enum}
              addressSuffix={
                <>
                  <span
                    className="contract-name ml-[4px] leading-[1.2]"
                    title={contractAddrNote}
                  >
                    ({contractAddrNote})
                  </span>

                  <img
                    onClick={(evt) => {
                      evt.stopPropagation();
                      openScanLinkFromChainItem(chainItem?.scanLink, item.id);
                    }}
                    src={IconExternal}
                    className={clsx('ml-6 w-[16px] h-[16px] cursor-pointer')}
                  />
                </>
              }
              openExternal={false}
            />
          </div>
        </div>

        <span className="text-[13px] text-[#fff]-subTitle flex-shrink-0 ml-auto font-medium">
          {item.list.length}{' '}
          {!onSelect && `Approval${item.list.length > 1 ? 's' : ''}`}
          {}
        </span>
        {onSelect && <IconArrowRight />}
      </div>
      {risky && (
        <Alert
          className={clsx(
            'mx-[16px]  rounded-[4px] px-[8px] py-[3px]',
            item.risk_level === 'danger' ? 'bg-[#ec5151]' : 'bg-orange'
          )}
          icon={
            <InfoCircleOutlined className="text-white pt-[4px] self-start" />
          }
          banner
          message={
            <span className="text-12 text-white">{item.risk_alert}</span>
          }
          type="error"
        />
      )}
    </div>
  );
};
