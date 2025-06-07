import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ListPage   from '../post/ListPage';
import WriterPage from '../post/WriterPage';  // 실제 파일명에 맞춰 수정
import ReadPage   from '../post/ReadPage';
import EditPage   from '../post/EditPage';

const PostRouter = () => {
  return (
    <Routes>
      <Route path='/'          element={<ListPage   />} />
      <Route path='write'      element={<WriterPage />} />
      <Route path=':id'        element={<ReadPage   />} />
      <Route path='edit/:id'   element={<EditPage   />} />
    </Routes>
  );
};

export default PostRouter;