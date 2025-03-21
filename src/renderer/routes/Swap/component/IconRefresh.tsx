import clsx from 'clsx';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { usePrevious } from 'react-use';

export const IconRefresh = memo(
  (
    props: React.SVGProps<SVGSVGElement> & {
      refresh: () => void;
      start?: boolean;
      loading?: boolean;
    }
  ) => {
    const { loading, className, refresh, start = true, ...other } = props;

    const clickAnimateElem = useRef<SVGAElement>();
    const repeatAnimateElem = useRef<SVGAElement>();

    const previousStart = usePrevious(start);

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
      if (!start) return;

      const listen = () => {
        let current = true;
        const beginEventFn = () => {
          setAnimate(true);
          refresh();
          setTimeout(() => {
            if (current) {
              setAnimate(false);
            }
          }, 1000);
        };

        clickAnimateElem.current?.addEventListener('beginEvent', beginEventFn);
        repeatAnimateElem.current?.addEventListener('repeatEvent', refresh);

        return () => {
          current = false;
          clickAnimateElem.current?.removeEventListener(
            'beginEvent',
            beginEventFn
          );
          repeatAnimateElem.current?.removeEventListener(
            'repeatEvent',
            refresh
          );
        };
      };
      const remove = listen();

      return remove;
    }, [refresh, start, loading]);

    useEffect(() => {
      if (!previousStart && start) {
        refresh();
      }
    }, [previousStart, refresh, start]);

    return (
      <svg
        key={!loading || animate ? 'animate' : 'stop'}
        id="arrow_loading"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-6 -6 36 36"
        className={clsx(
          'arrow-loading cursor-pointer',
          className || 'text-blue-light'
        )}
        width="36"
        height="36"
        {...other}
      >
        <path
          stroke="none"
          opacity="0.2"
          fill="#8697FF"
          d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z"
          className="background-path"
        />
        <defs>
          <path
            id="arrow"
            stroke="none"
            fill="none"
            d="M16.2751 7.78995C13.932 5.44681 10.133 5.44681 7.78986 7.78995C7.02853 8.55128 6.51457 9.4663 6.24798 10.4351C6.24473 10.4499 6.24114 10.4646 6.23719 10.4793C6.17635 10.7064 6.12938 10.9339 6.09577 11.161C5.83159 12.9457 6.39255 14.7026 7.52624 15.9944C7.61054 16.0901 7.69842 16.1838 7.78986 16.2752C8.08307 16.5685 8.39909 16.825 8.7322 17.0448C9.25533 17.3892 9.84172 17.6568 10.4798 17.8278C10.7386 17.8971 10.9979 17.9484 11.2565 17.9825C12.9537 18.2061 14.6187 17.6866 15.8747 16.6415C16.0123 16.5265 16.1459 16.4044 16.2751 16.2752C16.2848 16.2655 16.2947 16.2561 16.3047 16.2469C17.0123 15.531 17.5491 14.627 17.8283 13.5851C17.9712 13.0517 18.5196 12.7351 19.053 12.878C19.5865 13.021 19.9031 13.5693 19.7602 14.1028C19.3141 15.7676 18.3745 17.1684 17.1409 18.1899C16.1883 18.9822 15.0949 19.5189 13.9515 19.8002C11.8607 20.3147 9.6028 19.9749 7.7328 18.7809C7.06855 18.3579 6.47841 17.8432 5.97519 17.2589C5.12341 16.2738 4.55173 15.1302 4.26015 13.9324C4.01698 12.9416 3.96104 11.8931 4.12168 10.8379C4.36697 9.20484 5.1183 7.63309 6.37564 6.37574C9.49984 3.25154 14.5652 3.25154 17.6894 6.37574L18.2332 6.91959L18.2337 5.49951C18.2338 5.05769 18.5921 4.69964 19.034 4.69979C19.4758 4.69995 19.8338 5.05825 19.8337 5.50007L19.8325 9.03277L19.8322 9.8325L19.0325 9.83249L18.9401 9.83249C18.8146 9.85665 18.6854 9.85665 18.5599 9.83248L15.5005 9.83245C15.0587 9.83245 14.7005 9.47427 14.7005 9.03244C14.7005 8.59062 15.0587 8.23245 15.5005 8.23245L16.7176 8.23246L16.2751 7.78995Z"
          />
          <clipPath id="arrow-clip">
            <use href="#arrow" />
          </clipPath>
        </defs>
        <g clipPath="url(#arrow-clip)">
          <circle
            cx="12"
            cy="12"
            r="5"
            transform="rotate(365,12,12)"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeDasharray="30"
            strokeDashoffset="0"
          >
            {(!loading || animate) && (
              <animate
                attributeName="stroke-dashoffset"
                values="0;-30"
                begin="arrow_loading.click; 0.7s"
                repeatCount="indefinite"
                dur="29.3s"
                ref={repeatAnimateElem as any}
              />
            )}
          </circle>
        </g>
        <use href="#arrow" />
        <animateTransform
          id="transform_0"
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 0 0"
          to="-10 0 0"
          dur="0.07s"
          begin="arrow_loading.click;"
          ref={clickAnimateElem as any}
          repeatCount="1"
        />
        <animateTransform
          id="transform_1"
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="-45 0 0"
          to="390 0 0"
          dur="0.6s"
          begin="transform_0.end"
          repeatCount="1"
        />
        <animateTransform
          id="transform_2"
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="390 0 0"
          to="360 0 0"
          dur="0.15s"
          begin="transform_1.end"
          repeatCount="1"
        />
      </svg>
    );
  }
);
