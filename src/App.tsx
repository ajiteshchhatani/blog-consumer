import { useEffect, useRef, useState } from "react";
import "./index.css";

interface PostInfoStructure {
  blogId: string;
  id: string;
  postTitle: string;
  postDescription: string;
}

interface LiveBlogInfoStructure {
  id: string;
  blogname: string;
  posts: PostInfoStructure[];
}

function App() {
  const [blogData, setBlogData] = useState([] as LiveBlogInfoStructure[]);
  const wsServer = new WebSocket("ws://localhost:8000");

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      wsServer.onopen = () => {
        wsServer.send("=======Consumer app connected");
      };

      wsServer.onmessage = (event) => {
        const { data } = event;

        console.log(JSON.parse(data));
        setBlogData(JSON.parse(data));
      };
    }
  }, [divRef]);

  return (
    <div className="blogDataContainer" ref={divRef}>
      {blogData.length ? (
        <div>
          {blogData.map((blog) => (
            <div className="blogListContainer" key={blog.id}>
              <div>{blog.blogname}</div>
              {blog.posts.length ? (
                blog.posts.map((post) => (
                  <div key={post.id}>
                    <div>{post.postTitle}</div>
                    <div>{post.postDescription}</div>
                  </div>
                ))
              ) : (
                <div>No posts available</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No blogs available</div>
      )}
    </div>
  );
}
export default App;
