import React, { useState, useRef, useEffect } from 'react';
import { Input, Modal, List } from 'antd';
import { useRouter } from '@/router/hooks';
import { useUserInfo } from '@/store/userStore';
import { Permission } from '@/types/user';
import { Iconify } from '@/components/icon';
import styled from 'styled-components';

const SearchTrigger = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 var(--spacing-3);
  padding: var(--spacing-1) var(--spacing-2);
  cursor: pointer;
  background-color: rgba(var(--colors-palette-gray-400Channel), 0.3);
  border-radius: var(--borderRadius-lg);
  transition: all 0.2s;

  .search-icon {
    font-size: 14px;
    color: var(--colors-text-secondary);
    margin-right: var(--spacing-2);
  }

  .shortcut {
    margin-left: var(--spacing-1);
    padding: var(--spacing-1);
    color: var(--colors-text-secondary);
    background-color: var(--colors-background-default);
    border-radius: var(--borderRadius-lg);
    font-weight: 600;
    font-family: system-ui;
  }

  :root.dark & {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const SearchModal = styled(Modal)`
  .ant-modal-content {
    padding: 0;
    overflow: hidden;
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-input-affix-wrapper {
    border: none;
    border-radius: 0;
    padding: 12px 16px;
  }
  .ant-list-item {
    padding: 8px 16px;
    cursor: pointer;
    &:hover,
    &.selected {
      background-color: var(--colors-palette-gray-100);
    }
  }
  :root.dark & {
    .ant-list-item {
      &:hover,
      &.selected {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

interface Option {
  label: string;
  value: string;
  path: string;
}

const isMac = () => navigator.userAgent.toLowerCase().includes('mac');

const Search: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const userInfo = useUserInfo();
  const inputRef = useRef<any>(null);

  const flattenMenus = (permissions: Permission[] = []): Option[] => {
    return permissions.reduce<Option[]>((acc, item) => {
      if (!item.hide) {
        acc.push({
          label: item.label,
          value: item.path,
          path: item.path,
        });
      }
      if (item.children?.length) {
        acc.push(...flattenMenus(item.children));
      }
      return acc;
    }, []);
  };

  const allMenus = flattenMenus(userInfo.permissions);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const searchResult = allMenus.filter((menu) => menu.label.toLowerCase().includes(value.toLowerCase()));
    setOptions(searchResult);
    setSelectedIndex(-1);
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setIsModalOpen(false);
    setSearchValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && options[selectedIndex]) {
          handleSelect(options[selectedIndex].path);
        }
        break;
      case 'Escape':
        setIsModalOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isModalOpen]);

  return (
    <>
      <SearchTrigger onClick={() => setIsModalOpen(true)}>
        <Iconify icon="weui:search-filled" className="search-icon text-2xl" />
        <span className="shortcut text-xs">{isMac() ? '⌘+/' : 'Ctrl+/'}</span>
      </SearchTrigger>
      <SearchModal open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} width={500} centered closable={false}>
        <Input
          ref={inputRef}
          size="large"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          prefix={<Iconify icon="weui:search-filled" className="text-xl text-gray-400" />}
          placeholder="搜索菜单..."
          bordered={false}
          autoFocus
        />
        <List
          dataSource={options}
          style={{ maxHeight: '400px', overflowY: 'auto' }}
          renderItem={(item, index) => (
            <List.Item onClick={() => handleSelect(item.path)} className={index === selectedIndex ? 'selected' : ''}>
              <div className="flex items-center">
                <Iconify icon="solar:arrow-right-linear" className="mr-2 text-gray-400" />
                {item.label}
              </div>
            </List.Item>
          )}
        />
      </SearchModal>
    </>
  );
};

export default Search;
