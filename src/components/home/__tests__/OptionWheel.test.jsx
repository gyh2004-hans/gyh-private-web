import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OptionWheel from '../../reactbits/OptionWheel/OptionWheel';

describe('OptionWheel', () => {
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
});
