import { Spin } from 'antd';

export function CircleLoading() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex h-full items-center justify-center background-color-white">
      <Spin size="large" />
    </div>
  );
}
