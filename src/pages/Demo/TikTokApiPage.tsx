import React from "react";
import PageMeta from "../../components/common/PageMeta";
import TikTokApiDemo from "../../components/demo/TikTokApiDemo";

const TikTokApiPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="TikTok Shop API Demo | meup - React.js Admin Dashboard Template"
        description="This is TikTok Shop API Demo page for meup - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            TikTok Shop API Demo
          </h2>
        </div>

        <TikTokApiDemo />
      </div>
    </>
  );
};

export default TikTokApiPage;
