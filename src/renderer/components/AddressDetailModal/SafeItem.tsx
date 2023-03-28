import { useAccountToDisplay } from '@/renderer/hooks/rabbyx/useAccountToDisplay';
import { isSameAddress } from '@/renderer/utils/address';
import { Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import NameAndAddress from '../NameAndAddress';
import { useSafeQueue } from '../QueueModal/useSafeQueue';
import { AccountDetailItem } from './AccountDetailItem';

const IconTagYou = 'rabby-internal://assets/icons/queue/tag-you.svg';

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 20, color: '#8697ff' }} spin />
);

export const SafeItem: React.FC = () => {
  const { safeInfo, isLoading } = useSafeQueue();
  const { accountsList } = useAccountToDisplay();

  if (isLoading || !safeInfo) {
    return (
      <AccountDetailItem headline="Admins">
        <Spin indicator={LoadingIcon} />
      </AccountDetailItem>
    );
  }

  return (
    <AccountDetailItem
      headline="Admins"
      className="h-auto py-[20px]"
      description={
        <div className="text-[12px] text-[#FFFFFFCC]">
          Any transaction requires{' '}
          <span className="text-white text-[13px]">
            {safeInfo.threshold}/{safeInfo.owners.length}
          </span>{' '}
          confirmations
        </div>
      }
      details={
        <div className="mt-[20px]">
          <ul className="list-none m-0 p-0 space-y-[16px]">
            {safeInfo.owners.map((owner) => {
              const isYou = accountsList.find((account) =>
                isSameAddress(account.address, owner)
              );
              return (
                <li className={classNames('flex text-white')} key={owner}>
                  <NameAndAddress
                    address={owner}
                    className="text-[12px]"
                    nameClass="text-[12px] text-white font-normal"
                    addressClass="text-[12px] text-white"
                    copyIconClass="opacity-100"
                  />
                  {isYou ? <img src={IconTagYou} className="ml-[5px]" /> : null}
                </li>
              );
            })}
          </ul>
        </div>
      }
    />
  );
};