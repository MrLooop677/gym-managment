import { Link } from "react-router";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb = ({ pageTitle }: BreadcrumbProps) => {
  return (
    <div className="bg-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {pageTitle}
        </h1>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
