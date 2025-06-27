import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import { LoadMoreSpinner } from '@/components/common/Spinner';
import StickyHeader from '@/components/common/StickyHeader';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { SearchSvg } from '@/components/svgs';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useBookmarked } from '@/queries/post';

export default function BookmarkPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const debounced = useDebounce(input, 300);

    const { data = { pages: [], hasNextPage: false, nextCursor: null }, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookmarked(debounced);
    const posts = data.pages.flatMap((page) => page.posts) ?? [];

    const lastPostRef = useInfiniteScroll({hasNextPage, isFetchingNextPage, fetchNextPage});
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>Bookmarks</StickyHeader.Header>
            </StickyHeader>

            <section className='flex flex-col items-center my-2'>
                <div className='w-[95%] min-h-10'>
                    <div className='border border-gray-300 rounded-full focus-within:border-primary'>
                        <div className='flex items-center border border-transparent rounded-full focus-within:border-primary'>
                            <div>
                                <SearchSvg className='size-4 pl-3 shrink-0 box-content z-10' />
                            </div>
                            <input
                                type='text'
                                className='text-sm min-h-10 grow outline-0 pl-1 pr-4 placeholder:text-gray-500 text-gray-500 peer'
                                placeholder='Search Bookmarks'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <PageLayout.Content isLoading={isLoading}>
                {!debounced && posts.length === 0 && (
                    <EmptyState
                        title='Save posts for later'
                        description='Bookmark posts to easily find them again in the future.'
                    />
                )}

                {posts.length ? (
                    posts.map((post, idx) => {
                        const isLast = idx === posts.length - 1;
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                ref={isLast ? lastPostRef : undefined}
                            />
                        );
                    })
                ) : debounced && (
                    <EmptyState
                        title={`No results for ${debounced}`}
                        description='Try searching for something else, or check your Search settings to see if they’re protecting you from potentially sensitive content.'
                    />
                )}
            {hasNextPage && <LoadMoreSpinner />}
            </PageLayout.Content>
        </PageLayout>
    );
}
