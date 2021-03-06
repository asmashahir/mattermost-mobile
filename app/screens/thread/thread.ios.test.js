// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import Preferences from '@mm-redux/constants/preferences';
import {General, RequestStatus} from '@mm-redux/constants';

import PostList from 'app/components/post_list';

import ThreadIOS from './thread.ios';

jest.mock('react-intl');
jest.mock('react-native-image-picker', () => ({
    launchCamera: jest.fn(),
}));

describe('thread', () => {
    const baseProps = {
        actions: {
            selectPost: jest.fn(),
        },
        channelId: 'channel_id',
        channelType: General.OPEN_CHANNEL,
        displayName: 'channel_display_name',
        myMember: {last_viewed_at: 0, user_id: 'member_user_id'},
        rootId: 'root_id',
        theme: Preferences.THEMES.default,
        postIds: ['root_id', 'post_id_1', 'post_id_2'],
        channelIsArchived: false,
        threadLoadingStatus: {status: RequestStatus.STARTED},
        registerTypingAnimation: jest.fn(() => {
            return jest.fn();
        }),
    };

    test('should match snapshot, has root post', () => {
        const wrapper = shallow(
            <ThreadIOS {...baseProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should match snapshot, no root post, loading', () => {
        const newPostIds = ['post_id_1', 'post_id_2'];
        const wrapper = shallow(
            <ThreadIOS
                {...baseProps}
                postIds={newPostIds}
            />,
            {context: {intl: {formatMessage: jest.fn()}}},
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should match snapshot, render footer', () => {
        const wrapper = shallow(
            <ThreadIOS {...baseProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );

        // return loading
        expect(wrapper.find(PostList).getElement()).toMatchSnapshot();

        // return null
        wrapper.setProps({threadLoadingStatus: {status: RequestStatus.SUCCESS}});
        expect(wrapper.find(PostList).getElement()).toMatchSnapshot();

        // return deleted post
        const newPostIds = ['post_id_1', 'post_id_2'];
        wrapper.setProps({postIds: newPostIds});
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should add/remove typing animation on mount/unmount', () => {
        const wrapper = shallow(
            <ThreadIOS {...baseProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );
        const instance = wrapper.instance();

        expect(baseProps.registerTypingAnimation).toHaveBeenCalledTimes(1);
        expect(instance.removeTypingAnimation).not.toHaveBeenCalled();

        wrapper.unmount();
        expect(instance.removeTypingAnimation).toHaveBeenCalledTimes(1);
    });
});
