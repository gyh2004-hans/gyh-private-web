import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import OptionWheel from '../../reactbits/OptionWheel/OptionWheel';
import optionWheelStyles from '../../reactbits/OptionWheel/OptionWheel.css?raw';

describe('OptionWheel', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('滚轮移动时报告连续位置', async () => {
    const onPositionChange = vi.fn();
    const onChange = vi.fn();

    render(
      <OptionWheel
        items={['F1', 'M4', 'COLNAGO', 'FISH', 'PHOTO']}
        defaultSelected={0}
        side="right"
        onPositionChange={onPositionChange}
        onChange={onChange}
      />,
    );

    fireEvent.wheel(screen.getByRole('listbox'), {
      deltaY: 60,
      deltaMode: 0,
    });

    await waitFor(() => expect(onPositionChange).toHaveBeenCalled());
  });

  it('按 Enter 激活当前吸附主题', () => {
    const onActivate = vi.fn();

    render(
      <OptionWheel
        items={['F1', 'M4', 'COLNAGO', 'FISH', 'PHOTO']}
        defaultSelected={0}
        onActivate={onActivate}
      />,
    );

    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

    expect(onActivate).toHaveBeenCalledWith(1, 'M4');
  });

  it('连续滚动阶段只报告位置，停止吸附后才更新当前主题', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    render(
      <OptionWheel
        items={['F1', 'M4', 'COLNAGO', 'FISH', 'PHOTO']}
        defaultSelected={0}
        onChange={onChange}
      />,
    );

    fireEvent.wheel(screen.getByRole('listbox'), { deltaY: 60, deltaMode: 0 });
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(140);
    expect(onChange).toHaveBeenCalledWith(1, 'M4');
  });

  it('为键盘操作保留清晰的 focus-visible 指示', () => {
    expect(optionWheelStyles).toMatch(
      /\.option-wheel:focus-visible\s*\{[^}]*box-shadow:\s*inset\s+0\s+0\s+0\s+2px/,
    );
  });
});
