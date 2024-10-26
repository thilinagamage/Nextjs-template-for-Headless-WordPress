'use client';
import { gql } from '@apollo/client';
import client from '../../lib/apolloClient'; // Adjust import based on your folder structure
import { useState, useEffect } from 'react';

export default function Home() {
  // State for storing posts and pagination info
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial posts
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(after = null) {
    setLoading(true);

    const { data } = await client.query({
      query: gql`
        query GetPosts($after: String) {
          posts(first: 6, after: $after) {
            nodes {
              id
              slug
              title
              content
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: { after },
    });

    // Append new posts to the current posts
    setPosts((prevPosts) => [...prevPosts, ...data.posts.nodes]);
    setPageInfo(data.posts.pageInfo);
    setLoading(false);
  }

  // Load more posts when the button is clicked
  const loadMorePosts = () => {
    if (pageInfo?.hasNextPage) {
      fetchPosts(pageInfo.endCursor);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Latest Blog Posts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{post.title}</h2>
                <div className="text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />
                <a
                  href={`/post/${post.slug}`} // Assuming you will link to the post detail page
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Show Load More button if there are more posts to load */}
        {pageInfo?.hasNextPage && (
          <button
            onClick={loadMorePosts}
            className="mt-8 block mx-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Posts'}
          </button>
        )}
      </div>
    </div>
  );
}
