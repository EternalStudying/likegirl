import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import MessageBoard from '../src/components/MessageBoard.vue';
import type { Message } from '../src/types/site';

const messages: Message[] = [
  {
    id: 1,
    nickname: '小夏',
    content: '<strong>只显示纯文本</strong>',
    createdAt: '2026-04-20'
  }
];

describe('MessageBoard', () => {
  it('提交留言后调用 POST /api/messages 并刷新列表', async () => {
    const submitMessage = vi.fn().mockResolvedValue(undefined);
    const refreshMessages = vi.fn().mockResolvedValue([
      ...messages,
      { id: 2, nickname: '阿树', content: '今天也很好', createdAt: '2026-04-26' }
    ]);

    const wrapper = mount(MessageBoard, {
      props: { messages, submitMessage, refreshMessages }
    });

    await wrapper.get('input[name="nickname"]').setValue('阿树');
    await wrapper.get('textarea[name="content"]').setValue('今天也很好');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expect(submitMessage).toHaveBeenCalledWith({ nickname: '阿树', content: '今天也很好' });
    expect(refreshMessages).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('今天也很好');
  });

  it('留言内容不会通过 v-html 渲染', () => {
    const wrapper = mount(MessageBoard, {
      props: {
        messages,
        submitMessage: vi.fn(),
        refreshMessages: vi.fn()
      }
    });

    const messageText = wrapper.find('.message-item p');
    expect(messageText.text()).toBe('<strong>只显示纯文本</strong>');
    expect(messageText.html()).toContain('&lt;strong&gt;只显示纯文本&lt;/strong&gt;');
  });

  it('父组件刷新 messages 后同步显示最新留言', async () => {
    const wrapper = mount(MessageBoard, {
      props: {
        messages,
        submitMessage: vi.fn(),
        refreshMessages: vi.fn()
      }
    });

    await wrapper.setProps({
      messages: [{ id: 3, nickname: '后端', content: '真实留言', createdAt: '2026-04-26' }]
    });

    expect(wrapper.text()).toContain('真实留言');
    expect(wrapper.text()).not.toContain('<strong>只显示纯文本</strong>');
  });
});
