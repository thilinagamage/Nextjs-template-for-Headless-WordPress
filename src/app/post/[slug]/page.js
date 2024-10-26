'use client';  // Ensure this file is a client component

import { gql } from '@apollo/client';
import client from '../../../../lib/apolloClient';  // Adjust based on your folder structure
import { useState, useEffect } from 'react';

export default function SinglePostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = params;  // Get the slug from the URL

  useEffect(() => {
    async function fetchPost() {
      const { data } = await client.query({
        query: gql`
          query GetPostBySlug($slug: String!) {
            postBy(slug: $slug) {
              title
              content
            }
          }
        `,
        variables: { slug },
      });

      setPost(data.postBy);
      setLoading(false);
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
