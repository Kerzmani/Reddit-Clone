import "./styles/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./Pages/HomePage";
import PostPage from "./Pages/PostPage";
import ProfilePage from "./Pages/ProfilePage";
import SubmitPage from "./Pages/SubmitPage";
import SubredditPage from "./Pages/SubredditPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="r/:subredditName" element={<SubredditPage />} />
          <Route path="r/:subredditName/submit" element={<SubmitPage />} />

          <Route path="u/:username" element={<ProfilePage />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
