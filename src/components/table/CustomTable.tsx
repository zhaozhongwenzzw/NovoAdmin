import React from 'react';
import { ConfigProvider, Table, TableProps } from 'antd';
import { createStyles } from 'antd-style';
import { cn } from '@/utils/cn';

const useStyle = () => {
  const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);
  const tablePrefixCls = `.${getPrefixCls('table')}`;

  return createStyles(({ css }) => ({
    customTableStyle: css`
      height: 100%;
      display: flex;
      flex-direction: column;

      .ant-spin-nested-loading,
      .ant-spin-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      ${tablePrefixCls} {
        flex: 1;
        overflow: hidden;

        ${tablePrefixCls}-container {
          height: 100%;

          ${tablePrefixCls}-body {
            height: 100%;
            overflow: auto;
            // Firefox滚动条样式
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);

            &:hover {
              scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
            }

            // Webkit滚动条样式
            &::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }

            &::-webkit-scrollbar-thumb {
              background: transparent;
              border-radius: 6px;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            &::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 6px;
            }

            &:hover {
              &::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.15);

                &:hover {
                  background: rgba(0, 0, 0, 0.2);
                }

                &:active {
                  background: rgba(0, 0, 0, 0.25);
                }
              }
            }

            &::-webkit-scrollbar-corner {
              background: transparent;
            }
          }

          // 处理固定列的滚动条
          ${tablePrefixCls}-fixed-right {
            ${tablePrefixCls}-body-inner {
              // Firefox
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
              transition: scrollbar-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);

              &:hover {
                scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
              }

              // Webkit
              &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }

              &::-webkit-scrollbar-thumb {
                background: transparent;
                border-radius: 6px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }

              &::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 6px;
              }

              &:hover {
                &::-webkit-scrollbar-thumb {
                  background: rgba(0, 0, 0, 0.15);

                  &:hover {
                    background: rgba(0, 0, 0, 0.2);
                  }

                  &:active {
                    background: rgba(0, 0, 0, 0.25);
                  }
                }
              }
            }
          }
        }
      }
    `,
  }))();
};

const CustomTable: React.FC<TableProps<any>> = (props) => {
  const { rowKey, className, style, ...restProps } = props;
  const validRowKey = typeof rowKey === 'number' || typeof rowKey === 'symbol' ? String(rowKey) : rowKey;
  const { styles } = useStyle();

  return <Table rowKey={validRowKey} scroll={{ x: 1500 }} className={cn(styles.customTableStyle, className)} style={{ height: '100%', ...style }} {...restProps} />;
};

export default CustomTable;
