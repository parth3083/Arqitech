import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>This is visualizer page. and this is the id: {id}</div>;
};

export default page;
