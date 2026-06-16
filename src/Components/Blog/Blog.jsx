import React from "react";

const blogs = [
  {
    id: 1,
    title: "How Same-Day Delivery is Transforming E-Commerce in Bangladesh",
    author: "Zap Shift Team",
    date: "June 2026",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
    content:
      "Same-day delivery has become a game changer for online businesses. Customers now expect faster delivery times, which increases satisfaction and encourages repeat purchases. Zap Shift aims to help businesses meet these expectations efficiently."
  },
  {
    id: 2,
    title: "5 Essential Tips for Safe Parcel Packaging",
    author: "Operations Team",
    date: "June 2026",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    content:
      "Proper packaging reduces the risk of damage during transportation. Use strong boxes, protective materials, waterproof wrapping, and accurate labels to ensure safe delivery."
  },
  {
    id: 3,
    title: "Why Real-Time Parcel Tracking Builds Customer Trust",
    author: "Zap Shift Team",
    date: "May 2026",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    content:
      "Customers want transparency. Real-time tracking allows them to know where their parcel is at any moment, reducing uncertainty and increasing trust in the delivery service."
  },
  {
    id: 4,
    title: "Cash on Delivery vs Online Payment: Which is Better?",
    author: "Finance Team",
    date: "May 2026",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    content:
      "While Cash on Delivery remains popular in Bangladesh, online payments offer faster processing, better security, and improved business efficiency."
  }
];

const Blog = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <h1 className="text-4xl font-bold text-center mb-4">
        Zap Shift Blog
      </h1>

      <p className="text-center text-gray-500 mb-12">
        Insights, logistics tips, delivery trends, and industry updates.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold mb-2">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                By {blog.author} • {blog.date}
              </p>

              <p className="text-gray-600 mb-4">
                {blog.content}
              </p>

              <button className="btn btn-primary btn-sm">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;